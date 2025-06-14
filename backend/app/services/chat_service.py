import json
from openai import OpenAI
from app.core.config import settings
from app.services.supabase_service import insert_chat_title, insert_message

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def chat_stream(prompt: str, chat_id: str, new_chat: bool | None = None):
    insert_message(chat_id, "user", prompt)

    full_response = ""
    status_sent = {"thinking": False, "researching": False, "final_answer": False}

    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if not delta:
            continue

        full_response += delta

        # Detect stages from text
        stage = None
        if not status_sent["thinking"] and "Thought:" in full_response:
            stage = "thinking"
        elif not status_sent["researching"] and "Action:" in full_response:
            stage = "researching"
        elif not status_sent["final_answer"] and "Final Answer:" in full_response:
            stage = "final_answer"

        if stage:
            status_sent[stage] = True
            yield json.dumps({"type": "status", "value": stage}) + "\n\n"

        # Always yield the actual answer content for frontend streaming
        yield json.dumps({"type": "answer", "value": delta}) + "\n\n"

    insert_message(chat_id, "assistant", full_response)
    if new_chat:
        insert_chat_title(chat_id, prompt, full_response)
