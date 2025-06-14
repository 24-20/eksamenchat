# ───────────────────── app/services/chat_service.py (refactored) ─────────────────────
"""
SSE streaming service that runs ToolCallingAgent in a background thread,
powered by smolagents.LiteLLMModel.

Changes from original version:
  • Imports the single custom tool from app.tools.exam_problem_tool
  • Removes dynamic tool-collection logic (CUSTOM_TOOLS / ALL_TOOLS)
  • Keeps multithreading + SSE queue exactly as before
  • Uses the simpler model / agent instantiation pattern requested
"""

from __future__ import annotations

from typing import cast

import asyncio
import inspect
import json
import os
import threading
from concurrent.futures import ThreadPoolExecutor
from queue import Empty, Queue
from typing import AsyncGenerator

from smolagents import LiteLLMModel, ToolCallingAgent, WebSearchTool

from app.core.config import settings
from app.services.supabase_service import insert_chat_title, insert_message
from app.tools import exam_problem_tool as agent_module  # <-- module with @tool
from app.tools.exam_problem_tool import fetch_examproblem_description

# ────────────────────────── thread-pool ──────────────────────────
_EXECUTOR: ThreadPoolExecutor | None = None


def _get_executor() -> ThreadPoolExecutor:
    global _EXECUTOR
    if _EXECUTOR is None:
        _EXECUTOR = ThreadPoolExecutor(max_workers=4, thread_name_prefix="agent-pool")
    return _EXECUTOR


# ─────────────────── patch tool to emit "tool_call" ──────────────
_thread_local = threading.local()


def _patch_tools_once() -> None:
    """
    Wrap every user tool so we can stream the moment it's invoked.
    (Only fetch_examproblem_description lives in the module now.)
    """
    for name, fn in inspect.getmembers(agent_module, inspect.isfunction):
        if getattr(fn, "_smol_tool", False) and not getattr(fn, "_patched", False):

            def _make_wrapper(f):
                def _inner(*args, **kwargs):  # noqa: D401
                    _thread_local.q.put(
                        {
                            "type": "status",
                            "value": "tool_call",
                            "tool": f.__name__,
                        }
                    )
                    return f(*args, **kwargs)

                _inner._patched = True  # type: ignore[attr-defined]
                return _inner

            setattr(agent_module, name, _make_wrapper(fn))


_patch_tools_once()

# ─────────────────────── blocking agent runner ───────────────────
def _run_agent_sync(prompt: str, model_id: str, q: Queue) -> None:
    """
    Executes inside the thread-pool. Communicates via `q`.
    """
    _thread_local.q = q  # make queue visible to tool wrappers
    q.put({"type": "status", "value": "thinking"})

    # Build LiteLLMModel on every request so callers can pick models
    model = LiteLLMModel(
        model_id=model_id or "gpt-4o",
        api_key=settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", ""),
    )

    # ←────────────── requested "simple" agent setup ──────────────→
    agent = ToolCallingAgent(
        tools=[fetch_examproblem_description, WebSearchTool()],
        model=model,
    )

    try:

        answer = cast(str, agent.run(prompt))
        q.put({"type": "status", "value": "final_answer"})
        q.put({"type": "answer", "value": answer})
    except Exception as exc:  # noqa: BLE001
        q.put({"type": "error", "value": str(exc)})
    finally:
        q.put({"type": "_done"})


# ───────────────────────── public async API ──────────────────────
async def chat_stream(
    prompt: str,
    chat_id: str,
    model_name: str,
    new_chat: bool | None,
) -> AsyncGenerator[str, None]:
    """
    Yields JSON strings for Server-Sent Events. The parent FastAPI
    endpoint wraps each chunk as `data: …\n\n`.
    """
    insert_message(chat_id, "user", prompt)

    q: Queue = Queue()
    loop = asyncio.get_running_loop()
    loop.run_in_executor(_get_executor(), _run_agent_sync, prompt, model_name, q)

    while True:
        try:
            event = await loop.run_in_executor(_get_executor(), q.get, True, 0.1)
        except Empty:
            await asyncio.sleep(0.05)
            continue

        if event.get("type") == "_done":
            break

        yield json.dumps(event)

        if event.get("type") == "answer" and new_chat:
            insert_message(chat_id, "assistant", event["value"])
            insert_chat_title(chat_id, prompt, event["value"])
