from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from middleware.protect_endpoints import verify_authentication
from database.postgres import connect_db
from controllers.vaccination_option_controller import VaccinationOptionController
from schemas.vaccination_schemas import (
    VaccinationOptionCreate,
    VaccinationOptionResponse,
)

vaccination_options_router = APIRouter(
   prefix="/api/vaccination-options",
    tags=['Vaccination Options']
)


@vaccination_options_router.get('/all', response_model=List[VaccinationOptionResponse])
async def get_all_options(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationOptionController.get_all(db)


@vaccination_options_router.post('/create', response_model=VaccinationOptionResponse)
async def create_option(data: VaccinationOptionCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    # TODO: restrict to admin role when role support is added
    return await VaccinationOptionController.create(data, db)


@vaccination_options_router.put('/update/{option_id}', response_model=VaccinationOptionResponse)
async def update_option(option_id: str, data: VaccinationOptionCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    # TODO: restrict to admin role when role support is added
    return await VaccinationOptionController.update(option_id, data, db)


@vaccination_options_router.delete('/delete/{option_id}')
async def delete_option(option_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    # TODO: restrict to admin role when role support is added
    return await VaccinationOptionController.delete(option_id, db)
