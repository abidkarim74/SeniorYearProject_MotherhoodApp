from fastapi import APIRouter, Depends, Query
from uuid import UUID
from typing import List, Optional
from app.schemas.tutorial_schemas import (
    TutorialCreate, TutorialUpdate, TutorialResponse,
    TutorialViewCreate, TutorialViewResponse,
    TutorialRatingCreate, TutorialRatingResponse,
    TutorialStatsResponse
)
from app.database.postgres import connect_db
from middleware.protect_endpoints import verify_authentication
from sqlalchemy.ext.asyncio import AsyncSession
from app.controllers.tutorial_controllers import (
    TutorialControllers, 
    TutorialViewControllers,
    TutorialRatingControllers,
    TutorialStatsControllers
)
from app.models.tutorial import TutorialCategory


tutorial_router = APIRouter(
    prefix='/api/tutorials',
    tags=['Tutorial Routes']
)


# ==================== Tutorial CRUD ====================

@tutorial_router.post('/create', status_code=201)
async def create_tutorial_route(
    data: TutorialCreate, 
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Admin endpoint to create a new tutorial"""
    return await TutorialControllers.create(data, db)


@tutorial_router.get('/all', response_model=List[TutorialResponse])
async def get_all_tutorials_route(
    category: Optional[TutorialCategory] = Query(None),
    language: Optional[str] = Query(None),
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Get all tutorials with optional filtering by category and language"""
    return await TutorialControllers.get_all(payload['id'], category, language, db)


@tutorial_router.get('/tutorial/{tutorial_id}', response_model=TutorialResponse)
async def get_tutorial_by_id_route(
    tutorial_id: str,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Get a specific tutorial by ID"""
    return await TutorialControllers.get_by_id(UUID(tutorial_id), payload['id'], db)


@tutorial_router.put('/update/{tutorial_id}')
async def update_tutorial_route(
    tutorial_id: str,
    data: TutorialUpdate,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Admin endpoint to update a tutorial"""
    return await TutorialControllers.update(UUID(tutorial_id), data, db)


@tutorial_router.delete('/delete/{tutorial_id}', status_code=204)
async def delete_tutorial_route(
    tutorial_id: str,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Admin endpoint to delete a tutorial (soft delete)"""
    return await TutorialControllers.delete(UUID(tutorial_id), db)


# ==================== Tutorial Views ====================

@tutorial_router.post('/tutorial/{tutorial_id}/view', status_code=201, response_model=TutorialViewResponse)
async def record_tutorial_view_route(
    tutorial_id: str,
    data: TutorialViewCreate,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Record that a user viewed a tutorial"""
    return await TutorialViewControllers.record_view(UUID(tutorial_id), payload['id'], data, db)


@tutorial_router.get('/my-views', response_model=List[TutorialViewResponse])
async def get_user_views_route(
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Get all tutorials viewed by the current user"""
    return await TutorialViewControllers.get_user_views(payload['id'], db)


# ==================== Tutorial Ratings ====================

@tutorial_router.post('/tutorial/{tutorial_id}/rate', status_code=201, response_model=TutorialRatingResponse)
async def rate_tutorial_route(
    tutorial_id: str,
    data: TutorialRatingCreate,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Rate a tutorial (1-5 stars) - creates new rating or updates existing"""
    return await TutorialRatingControllers.create_or_update(UUID(tutorial_id), payload['id'], data, db)


@tutorial_router.get('/tutorial/{tutorial_id}/ratings', response_model=List[TutorialRatingResponse])
async def get_tutorial_ratings_route(
    tutorial_id: str,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Get all ratings for a specific tutorial"""
    return await TutorialRatingControllers.get_tutorial_ratings(UUID(tutorial_id), db)


@tutorial_router.delete('/tutorial/{tutorial_id}/rating', status_code=204)
async def delete_rating_route(
    tutorial_id: str,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Delete user's rating for a tutorial"""
    return await TutorialRatingControllers.delete(UUID(tutorial_id), payload['id'], db)


# ==================== Statistics ====================

@tutorial_router.get('/stats', response_model=TutorialStatsResponse)
async def get_tutorial_stats_route(
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    """Get overall tutorial statistics"""
    return await TutorialStatsControllers.get_stats(db)