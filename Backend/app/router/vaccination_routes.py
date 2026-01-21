from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging
from uuid import UUID
from typing import List
from app.schemas.vaccine_schemas import VaccineWithSchedulesResponse, VaccinationPendingSchemaResponse
from datetime import date
from app.database.postgres import connect_db
from app.middleware.protect_endpoints import verify_authentication
from app.controllers.vaccination_controllers import VaccinationControllers


vaccine_router = APIRouter(prefix="/api/vaccines", tags=["vaccines"])
logger = logging.getLogger(__name__)


@vaccine_router.get('/all', response_model=List[VaccineWithSchedulesResponse])
async def get_all_vaccines(payload = Depends(verify_authentication), db: AsyncSession =  Depends(connect_db)):
    return await VaccinationControllers.get_all_vaccines(db)


@vaccine_router.get('/pending')
async def get_pending_vaccines(payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await VaccinationControllers.get_pending_vaccines(payload['id'], db)



from pydantic import BaseModel

class VaccineRecordRequest(BaseModel):
    given_date: str
    child_id: UUID
    vaccine_id: UUID
    schedule_id: UUID

@vaccine_router.post('/add-record')
async def add_vaccine_record(
    request: VaccineRecordRequest,
    payload = Depends(verify_authentication), 
    db: AsyncSession = Depends(connect_db)
):
    return await VaccinationControllers.add_vaccine_record(
        request.given_date, 
        request.child_id, 
        request.vaccine_id, 
        request.schedule_id, 
        db
    )