
from supabase import create_client
from app.core.config import settings
import openai

from datetime import date

assert settings.SUPABASE_URL is not None, "SUPABASE_URL must be set"
assert settings.SUPABASE_KEY is not None, "SUPABASE_KEY must be set"

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def insert_message(chat_id: str, role: str, content: str):
    """Insert a single message into the messages table."""
    response = supabase.table("messages").insert({
        "chat_id": chat_id,
        "role": role,
        "content": content,
        "created_at": date.today().isoformat()
    }).execute()
    return response


def insert_chat_title(chat_id: str, user_message: str, assistant_response: str):
    """Insert a new chat record into chats table after generating a title."""
    full_text = f"{user_message.strip()} {assistant_response.strip()}"

    # Use OpenAI to generate a short title from the conversation
    title_response = openai.OpenAI(api_key=settings.OPENAI_API_KEY).chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Generate a short 5-6 word title for this conversation."},
            {"role": "user", "content": full_text}
        ]
    )

    title = title_response.choices[0].message.content

    response = supabase.table("chats").update({
        "title": title,
    }).eq("id", chat_id).execute()
    return response
