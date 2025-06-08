# app/api/v1/endpoints/chat.py
from typing import List
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from ....services.chat_service import chat_stream

router = APIRouter()


class Message(BaseModel):
    content: str
    isUser: bool

class PromptRequest(BaseModel):
    prompt: str
    kb: str
    model: str
    messages: List[Message]


@router.post("/stream")
async def stream_chat(request: PromptRequest):
    print('Received data:', request.prompt, request.kb, request.model, "\n \n"
          'lol', flush=True)

    for obj in request.messages:
        print('****** \n','IsUser: ',obj.isUser, '\n content :',obj.content," \n******")
    async def event_generator():
        async for chunk in chat_stream(request.prompt):
            yield f"data: {chunk}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
