from pydantic import BaseModel, ConfigDict
from uuid import UUID
from models.community import PostType
from typing import List
from datetime import datetime


class PostBase(BaseModel):
    user_id: UUID
    title: str
    tags: List[str] | None = None
    images: List[str] | None = None
    description: str
    post_type: PostType | None = None
    
    
class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    description: str | None = None


class PostChangeVisiblity(BaseModel):
    visible: bool | None = None
    
    
class MiniUserSchema(BaseModel):
    firstname: str
    lastname: str
    username: str
    profile_pic: str | None = None
    
    
class PostResponse(BaseModel):
    user_id: UUID
    user: MiniUserSchema
    title: str
    tags: List[str] | None = None
    images: List[str] | None = None
    description: str
    post_type: PostType | None = None
    id: UUID
    visible: bool
    post_category: str
    like_count: int
    created_at: datetime
    likers: List[UUID] = []
    
    
    
    model_config = ConfigDict(from_attributes=True)





