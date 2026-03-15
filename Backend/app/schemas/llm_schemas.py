
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from app.models.ai import MessageType



class ConversationSummarySchema(BaseModel):
    topic: str
    last_messages: list[str]


class AiConversationBaseSchema(BaseModel):
    user_id: UUID
    topic: str
    created_at: datetime
    updated_at: datetime
    
    
class AiConversationResponseSchema(AiConversationBaseSchema):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class AiConversationUpdate(BaseModel):
    con_id: UUID
    message: str



class AIMessageBaseSchema(BaseModel):
    conversation_id: UUID
    user_id: UUID
    message_type: MessageType
    content: str


class AIMessageCreateSchema(AIMessageBaseSchema):
    pass


class AIMessageResponseSchema(AIMessageBaseSchema):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



from enum import Enum


class AIChatOption(str, Enum):
    MEDICAL = "child_medical"
    ALLERGY = "child_allergy"
    FEEDING = "child_feeding"
    GENERAL = "general_parent"



# NEW SCHEMAS
class UserPrompt(BaseModel):
    conv_type: AIChatOption = AIChatOption.GENERAL
    prompt: str