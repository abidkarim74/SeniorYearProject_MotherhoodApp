
from pydantic import BaseModel, ConfigDict
from uuid import UUID


class AiConversationBaseSchema(BaseModel):
    id: UUID
    user_id: UUID
    topic: str
    
class AiConversationResponseSchema(AiConversationBaseSchema):
    model_config = ConfigDict(from_attributes=True)
