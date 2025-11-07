from fastapi import APIRouter
from schemas.child_medical_schemas import MedicalConditionCreate, MedicalConditionUpdate, MedicalConditionResponse
from middleware.protect_endpoints import verify_authentication
from database.db import connect_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from schemas.child_medical_schemas import VaccinationCreate, VaccinationResponse, VaccinationUpdate, VaccinationMiniResponse
from controllers.child_health_controllers import MedicalConditionController, ChildVaccinationController


child_health_router = APIRouter(
    prefix='/api/child-health',
    tags=['Child Health Routes']
)

# Medical conditions routes
@child_health_router.post('/medical-conditions', status_code=201)
async def create_medical_condition(data: MedicalConditionCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await MedicalConditionController.create(data, payload['id'], db)


@child_health_router.get('/medical-conditions/{child_id}', response_model=List[MedicalConditionResponse])
async def medical_conditions_list(child_id: UUID, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await MedicalConditionController.v_list(child_id, payload['id'], db)


@child_health_router.get('/medical-conditions/{condition_id}', response_model=MedicalConditionResponse)
async def medical_condition_detail(condition_id: UUID, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await MedicalConditionController.detail(condition_id, payload['id'], db)


@child_health_router.put('/medical-conditions/update/{condition_id}', response_model=MedicalConditionResponse)
async def medical_condition_update(condition_id: UUID, data: MedicalConditionUpdate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await MedicalConditionController.update(condition_id, data, payload['id'], db)


@child_health_router.delete('/medical-conditions/delete/{condition_id}')
async def medical_condition_delete(condition_id: UUID, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await MedicalConditionController.delete(condition_id, payload['id'], db)


# Vaccination Routes
@child_health_router.post('/vaccinations', status_code=201, response_model=VaccinationMiniResponse)
async def create_vaccination(data: VaccinationCreate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ChildVaccinationController.create(data, payload['id'], db)


@child_health_router.get('/vaccinations/{child_id}', response_model=List[VaccinationMiniResponse])
async def vaccination_list(child_id: UUID, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ChildVaccinationController.v_list(child_id, payload['id'], db)


@child_health_router.get('/vaccinations/detail/{vaccine_id}', response_model=VaccinationResponse)
async def vaccination_detail(vaccine_id: UUID, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ChildVaccinationController.detail(vaccine_id, payload['id'], db)


@child_health_router.put('/vaccinations/update/{vaccine_id}', response_model=VaccinationResponse)
async def vaccination_update(vaccine_id: UUID, data: VaccinationUpdate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ChildVaccinationController.update(vaccine_id, data, payload['id'], db)


@child_health_router.delete('/vaccinations/delete/{vaccine_id}')
async def vaccination_delete(vaccine_id: UUID, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    return await ChildVaccinationController.delete(vaccine_id, payload['id'], db)