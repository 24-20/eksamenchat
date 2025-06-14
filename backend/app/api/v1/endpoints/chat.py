from typing import List, AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.chat_service import chat_stream

router = APIRouter()


# ----- request / response models --------------------------------------------------
class Message(BaseModel):
    content: str
    isUser: bool


class PromptRequest(BaseModel):
    prompt: str
    kb: str
    model: str
    messages: List[Message]
    chatId: str
    newChat: bool | None = None


@router.post("/stream")
async def stream_chat(request: PromptRequest) -> StreamingResponse:
    async def event_generator() -> AsyncGenerator[str, None]:
        async for payload in chat_stream(
            request.prompt,          # prompt
            request.chatId,          # chat_id
            request.model,           # model_name  ← add this
            request.newChat,         # new_chat
        ):
            yield f"data: {payload}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache"},
    )
