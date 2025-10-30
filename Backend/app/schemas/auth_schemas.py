from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional


class UserBaseSchema(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    username: str
    image_url: Optional[str] = None 


class UserCreateSchema(UserBaseSchema):
    password: str
    
    
class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserResponseSchema(UserBaseSchema):
    id: UUID

    class Config:
        orm_mode = True  


class TokenPayload(BaseModel):
    id: str
