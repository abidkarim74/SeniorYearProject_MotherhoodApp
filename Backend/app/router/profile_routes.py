from fastapi import APIRouter, Depends
from schemas.profile_schemas import MotherProfileResponse, MotherProfileUpdate
from middleware.protect_endpoints import verify_authentication
from sqlalchemy.ext.asyncio import AsyncSession
from database.postgres import connect_db
from controllers.profile_controllers import ProfileController
from schemas.child_schemas import ChildMiniResponseSchema
from typing import List


profile_router = APIRouter(
    prefix='/api/user-profile',
    tags=['User Profile Routes']
)


@profile_router.get('/get-children', response_model=List[ChildMiniResponseSchema])
async def mother_children_route(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ProfileController.get_children(payload['id'], db)


@profile_router.get('/mother/{id}', response_model=MotherProfileResponse)
async def mother_profile_detail(id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ProfileController.detail(id, db)


@profile_router.put('/update')
async def mother_profile_update(data: MotherProfileUpdate ,payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ProfileController.update(payload['id'], data, db)


@profile_router.delete('/delete')
async def delete_route(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ProfileController.delete(payload['id'], db)



