from pydantic import BaseModel, ConfigDict, Field, validator
from uuid import UUID
from app.models.tutorial import TutorialCategory, TutorialLanguage
from datetime import datetime
from typing import Optional


class TutorialBase(BaseModel):
    name: str
    description: str | None = None
    url: str
    category: TutorialCategory
    language: TutorialLanguage
    thumbnail_url: str | None = None
    duration_minutes: int | None = None


class TutorialCreate(TutorialBase):
    pass


class TutorialUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    url: str | None = None
    category: TutorialCategory | None = None
    language: TutorialLanguage | None = None
    thumbnail_url: str | None = None
    duration_minutes: int | None = None
    is_active: bool | None = None


class TutorialResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    url: str
    category: TutorialCategory
    language: TutorialLanguage
    thumbnail_url: str | None
    duration_minutes: int | None
    is_active: bool
    created_at: datetime
    average_rating: float | None = None
    total_ratings: int = 0
    total_views: int = 0
    user_has_rated: bool = False
    user_rating: int | None = None
    
    model_config = ConfigDict(from_attributes=True)


class TutorialViewCreate(BaseModel):
    watch_duration_minutes: int | None = None
    completed: bool = False


class TutorialViewResponse(BaseModel):
    id: UUID
    tutorial_id: UUID
    user_id: UUID
    watched_at: datetime
    watch_duration_minutes: int | None
    completed: bool
    
    model_config = ConfigDict(from_attributes=True)


class TutorialRatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5")
    review: str | None = None
    
    @validator('rating')
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v


class TutorialRatingUpdate(BaseModel):
    rating: int | None = Field(None, ge=1, le=5, description="Rating must be between 1 and 5")
    review: str | None = None
    
    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v


class TutorialRatingResponse(BaseModel):
    id: UUID
    tutorial_id: UUID
    user_id: UUID
    rating: int
    review: str | None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TutorialStatsResponse(BaseModel):
    total_tutorials: int
    total_views: int
    total_ratings: int
    average_rating: float | None
    tutorials_by_category: dict