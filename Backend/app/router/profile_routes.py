from fastapi import APIRouter, Depends
from schemas.profile_schemas import MotherProfileResponse, MotherProfileUpdate
from middleware.protect_endpoints import verify_authentication
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import connect_db


profile_router = APIRouter(
    prefix='/api/profiles',
    tags=['Profiles']
)


@profile_router.get('/mother/{id}', response_model=MotherProfileResponse)
async def mother_profile_detail(id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass


@profile_router.put('/update', response_model=MotherProfileResponse)
async def mother_profile_update(data: MotherProfileUpdate ,payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass


@profile_router.put('/delete', response_model=MotherProfileResponse)
async def mother_profile_update(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass



