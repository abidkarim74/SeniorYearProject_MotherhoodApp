from pydantic import BaseModel, EmailStr, constr, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime
from typing import List
from models.child import GenderEnum


class MotherProfileResponse(BaseModel):
    id: UUID = Field(default_factory=uuid4) 
    firstname: str
    lastname: str
    username: str
    email: EmailStr
    profile_pic: str | None = None  
    
    date_of_birth: datetime 
    phone_number: constr(pattern=r'^\+?\d{10,15}$') # type: ignore
    address: str
    city: str
    country: str
    
    number_of_children: int = 0
    blood_type: str | None = None
    notification_enabled: bool = True
    preferred_language: str = "en"
    account_created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config():
        orm_mode = True


class MotherProfileUpdate(BaseModel):
    firstname: str | None = Field(default=None, max_length=50)
    lastname: str | None = Field(default=None, max_length=50)
    address: str | None = Field(default=None, max_length=255)
    city: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)
    blood_type: str | None = Field(default=None, pattern=r'^(A|B|AB|O)[+-]$')  



# class ChildProfileResponse(BaseModel):
#     id: UUID
#     firstname: str
#     lastname: Optional[str]
#     profile_pic: Optional[str]
#     mother_id: UUID
#     gender: Optional[GenderEnum]
#     date_of_birth: Optional[datetime]
#     blood_type: Optional[str]
#     pictures: Optional[List[str]]
#     height: Optional[float]
#     weight: Optional[float]
#     head_circumference: Optional[float]
#     allergies: Optional[str]
#     medical_conditions: Optional[str]
#     created_at: datetime
#     updated_at: datetime

#     class Config:
#         orm_mode = True