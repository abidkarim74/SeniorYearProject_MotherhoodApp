from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from middleware.protect_endpoints import verify_authentication
from database.postgres import connect_db
from controllers.vaccination_schedule_controller import VaccinationScheduleController
from schemas.vaccination_schemas import (
    VaccinationScheduleCreate,
    VaccinationScheduleResponse,
)

vaccination_schedules_router = APIRouter(
   prefix="/api/vaccination-schedule",
    tags=['Vaccination Schedules']
)

@vaccination_schedules_router.get('/all', response_model=List[VaccinationScheduleResponse])
async def get_all_schedules(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationScheduleController.get_all(db)

@vaccination_schedules_router.get('/vaccine/{vaccine_id}', response_model=List[VaccinationScheduleResponse])
async def get_schedules_for_vaccine(vaccine_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationScheduleController.get_by_vaccine(vaccine_id, db)


@vaccination_schedules_router.post('/create', response_model=VaccinationScheduleResponse)
async def create_schedule(data: VaccinationScheduleCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    # TODO: restrict to admin role when role support is added
    return await VaccinationScheduleController.create(data, db)


@vaccination_schedules_router.put('/update/{schedule_id}', response_model=VaccinationScheduleResponse)
async def update_schedule(schedule_id: str, data: VaccinationScheduleCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    # TODO: restrict to admin role when role support is added
    return await VaccinationScheduleController.update(schedule_id, data, db)


@vaccination_schedules_router.delete('/delete/{schedule_id}')
async def delete_schedule(schedule_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    # TODO: restrict to admin role when role support is added
    return await VaccinationScheduleController.delete(schedule_id, db)
