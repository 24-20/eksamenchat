from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "https://your-vercel-domain.vercel.app",
    ]

settings = Settings()

