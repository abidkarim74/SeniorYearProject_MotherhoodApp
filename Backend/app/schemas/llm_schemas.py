from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from app.models.ai import MessageType
from enum import Enum
from typing import Optional, List


class AiConversationBase(BaseModel):
    topic: str = Field(..., min_length=1)
    messages_exist: Optional[bool] = False
    last_messages: Optional[List[str]] = None
    summary: Optional[str] = None



class AiConversationCreate(AiConversationBase):
    user_id: UUID



class AiConversationUpdate(BaseModel):
    messages_exist: Optional[bool] = None
    last_messages: Optional[List[str]] = None
    summary: Optional[str] = None



class AiConversationResponse(AiConversationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  




# class MessageType(PyEnum):
#     HUMAN = "human"
#     AI = "ai"


# class ChatbotMessage(Base):
#     __tablename__ = 'chatbot_messages'

#     id: Mapped[u] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
#     conversation_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey('ai_conversations.id'), nullable=False, index=True)

#     user_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True, index=True)
    
#     message_type: Mapped[MessageType] = mapped_column(Enum(MessageType), nullable=False)
#     content: Mapped[str] = mapped_column(String, nullable=False)
    
#     created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    


class AIChatOption(str, Enum):
    MEDICAL = "child_medical"
    ALLERGY = "child_allergy"
    FEEDING = "child_feeding"
    GENERAL = "general_parent"



# NEW SCHEMAS
class UserPrompt(BaseModel):
    conv_type: AIChatOption = AIChatOption.GENERAL
    prompt: str