
"use client";

import { useState, useRef } from "react";

type Status =
  | "idle"
  | "thinking"
  | "tool_call"
  | "final_answer"
  | `tool:${string}`;

export default function ChatPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [answer, setAnswer] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const send = async () => {
    const prompt = inputRef.current?.value.trim();
    if (!prompt) return;

    // Reset UI
    setAnswer("");
    setStatus("idle");

    // POST body identical to PromptRequest
    const body = {
      prompt,
      kb: "default",
      model: "gpt-4o",
      messages: [{ content: prompt, isUser: true }],
      chatId: crypto.randomUUID(),
      newChat: true,
    };

    const resp = await fetch("http://localhost:8000/api/v1/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(body),
    });

    if (!resp.body) throw new Error("No stream returned");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const raw of parts) {
        if (!raw.startsWith("data: ")) continue;
        try {
          const evt = JSON.parse(raw.slice(6)) as {
            type: string;
            value: string;
            tool?: string;
          };

          if (evt.type === "status") {
            if (evt.value === "tool_call" && evt.tool) {
              setStatus(`tool:${evt.tool}` as Status);
            } else {
              setStatus(evt.value as Status);
            }
          } else if (evt.type === "answer") {
            setAnswer((prev) => prev + evt.value);
          }
        } catch {
          /* ignore malformed chunks */
        }
      }
    }
    setStatus("idle");
  };

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold mb-4">SmolAgent Chat</h1>

      <textarea
        ref={inputRef}
        rows={4}
        className="w-full rounded border p-2"
        placeholder="Ask me anything…"
      />

      <button
        onClick={send}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-40"
      >
        Send
      </button>

      <section className="mt-6 whitespace-pre-wrap">
        {status !== "idle" && (
          <p className="mb-2 text-sm text-gray-500">
            {status.startsWith("tool:")
              ? `Calling tool ${status.slice(5)}…`
              : status === "thinking"
                ? "🤔 Thinking…"
                : status === "final_answer"
                  ? "✅ Final answer:"
                  : status}
          </p>
        )}
        <p>{answer}</p>
      </section>
    </main>
  );
}
