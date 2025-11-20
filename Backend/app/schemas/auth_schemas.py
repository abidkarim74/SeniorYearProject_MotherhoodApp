from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional


class UserBaseSchema(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    username: str


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


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str