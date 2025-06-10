from openai import OpenAI
from app.core.config import settings
from app.services.supabase_service import insert_message, insert_chat_title

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def chat_stream(prompt: str, chat_id: str, new_chat: bool | None = None):
    insert_message(chat_id, "user", prompt)

    full_response = ""
    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            full_response += delta
            yield delta

    insert_message(chat_id, "assistant", full_response)
    if new_chat:
        insert_chat_title(chat_id, prompt, full_response)
