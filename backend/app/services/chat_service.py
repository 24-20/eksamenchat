from openai import OpenAI
from app.core.config import settings
from typing import Optional
from dotenv import load_dotenv
import os


OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

async def chat_stream(prompt: str):
    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta

