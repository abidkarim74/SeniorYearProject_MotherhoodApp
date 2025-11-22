from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from middleware.protect_endpoints import verify_authentication
from database.db import connect_db
from controllers.vaccination_record_controller import VaccinationRecordController
from schemas.vaccination_schemas import (
    VaccinationRecordCreate,
    VaccinationRecordUpdate,
    VaccinationRecordResponse,
)

vaccination_records_router = APIRouter(
     prefix="/api/vaccination-records",
    tags=['Vaccination Records']
)


@vaccination_records_router.get('/child/{child_id}', response_model=List[VaccinationRecordResponse])
async def get_child_records(child_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationRecordController.get_child_records(payload['id'], child_id, db)


@vaccination_records_router.post('/create', response_model=VaccinationRecordResponse)
async def create_record(data: VaccinationRecordCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationRecordController.create(payload['id'], data, db)


@vaccination_records_router.put('/update/{record_id}', response_model=VaccinationRecordResponse)
async def update_record(record_id: str, data: VaccinationRecordUpdate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationRecordController.update(payload['id'], record_id, data, db)


@vaccination_records_router.delete('/delete/{record_id}')
async def delete_record(record_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationRecordController.delete(payload['id'], record_id, db)
