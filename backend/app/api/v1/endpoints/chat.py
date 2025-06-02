# app/api/v1/endpoints/chat.py

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from ....services.chat_service import chat_stream

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str

@router.post("/stream")
async def stream_chat(request: PromptRequest):
    print('Received prompt:', request.prompt, flush=True)

    async def event_generator():
        async for chunk in chat_stream(request.prompt):
            yield f"data: {chunk}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
