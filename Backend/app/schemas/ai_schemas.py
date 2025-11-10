from pydantic import BaseModel
from typing import Optional
from dataclasses import dataclass


class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    latency: float
    error: Optional[str] = None


@dataclass
class GeminiResponse:
    prompt: str
    response_text: Optional[str]
    error: Optional[str]
    latency: float