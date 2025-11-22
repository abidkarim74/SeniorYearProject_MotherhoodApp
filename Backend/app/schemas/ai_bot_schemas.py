from pydantic import BaseModel, ConfigDict

from uuid import UUID


class AIBotBase(BaseModel):
    name: str
    description: str
    

class AIBotCreate(AIBotBase):
    pass

    
class AIBotResponse(AIBotBase):
    id: UUID
    user_id: UUID
    
    model_config = ConfigDict(from_attributes=True)

    
    