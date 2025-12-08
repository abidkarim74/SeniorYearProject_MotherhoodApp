from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List
from schemas.community_schemas import PostCreate, PostResponse, PostUpdate, PostChangeVisiblity
from database.postgres import connect_db
from middleware.protect_endpoints import verify_authentication
from sqlalchemy.ext.asyncio import AsyncSession
from controllers.community_controllers import PostControllers, PostLikeControllers


community_router = APIRouter(
    prefix='/api/community',
    tags=['Community Routes']
)


@community_router.post('/create-post', status_code=201)
async def create_post_route(data: PostCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostControllers.create(payload['id'], data, db)


@community_router.get('/my-posts', response_model=List[PostResponse])
async def my_posts_route(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostControllers.auth_posts(payload['id'], db)


@community_router.get('/feed', response_model=List[PostResponse])
async def feed_posts_route(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostControllers.other_posts(payload['id'], db)


@community_router.get('/post/{post_id}')
async def post_detail_route(post_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostControllers.detail(UUID(post_id), payload['id'], db)


@community_router.put('/update-post/{post_id}')
async def update_post_route(post_id: str, data: PostUpdate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostControllers.update(UUID(post_id), payload['id'], data, db)


@community_router.patch('/change-visibility/{post_id}')
async def change_visibility_route(post_id: str, data: PostChangeVisiblity, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostControllers.change_visibility(UUID(post_id), payload['id'], data, db)


@community_router.delete('/delete-post/{post_id}', status_code=204)
async def delete_post_route(post_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostControllers.delete(UUID(post_id), payload['id'], db)


@community_router.post('/post/toogle-like/{post_id}')
async def toogle_like(post_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await PostLikeControllers.toggle_like(post_id, payload['id'], db)



@community_router.get('/members/all')
async def all_community_members(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    
    pass