from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ....services.chat_service import chat_stream

router = APIRouter()

@router.post("/stream")
async def stream_chat(prompt: str):
    async def event_generator():
        async for chunk in chat_stream(prompt):
            yield f"data: {chunk}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")

