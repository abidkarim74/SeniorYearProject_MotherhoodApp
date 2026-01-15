
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


class AiConversationBaseSchema(BaseModel):
    id: UUID
    user_id: UUID
    topic: str
    created_at: datetime
    updated_at: datetime
    
    
class AiConversationResponseSchema(AiConversationBaseSchema):
    model_config = ConfigDict(from_attributes=True)


class AiConversationUpdate(BaseModel):
    con_id: UUID
    message: str