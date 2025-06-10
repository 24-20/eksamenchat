from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "https://your-vercel-domain.vercel.app",
    ]
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY")


settings = Settings()

