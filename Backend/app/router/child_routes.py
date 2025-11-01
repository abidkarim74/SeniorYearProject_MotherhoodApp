from fastapi import APIRouter, Depends
from schemas.child_schemas import ChildCreateSchema, ChildResponseSchema, ChildBaseUpdateSchema, ChildPhysicalInfoUpdate
from middleware.protect_endpoints import verify_authentication
from database.db import connect_db
from sqlalchemy.ext.asyncio import AsyncSession


child_router = APIRouter(
    prefix='/api/child',
    tags=['Child Routes']
)

@child_router.post('/create', status_code=201)
async def create_route(data: ChildCreateSchema, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass


@child_router.get('/detail/{id}', response_model=ChildResponseSchema)
async def detail_route(id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass


@child_router.put('/update-personal-info/{id}')
async def update_personal_info_route(id: str, data: ChildBaseUpdateSchema, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass


@child_router.put('/update-physical-info/{id}')
async def update_physical_info_route(id: str, data: ChildPhysicalInfoUpdate, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass


@child_router.delete('/delete/{child_id}')
async def delete_route(child_id: str, payload = Depends(verify_authentication), db: AsyncSession = Depends(connect_db)):
    pass
