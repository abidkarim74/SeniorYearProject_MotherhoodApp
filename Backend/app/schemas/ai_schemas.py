from pydantic import BaseModel
from typing import Optional
from dataclasses import dataclass
from pydantic import BaseModel, Field
from bson import ObjectId # type: ignore
from enum import Enum


class MessageType(str, Enum):
    AI = "AI"
    HUMAN = "Human"
    

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
        
    @classmethod
    def validate(cls, v):
        return ObjectId(str(v))
    

class AiMessageModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversation_id: str
    content: str
    sender: str 
    sender_type: MessageType
    created_at: str 



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