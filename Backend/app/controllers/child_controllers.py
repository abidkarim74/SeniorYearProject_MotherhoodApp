from sqlalchemy.ext.asyncio import AsyncSession
from schemas.child_schemas import ChildCreateSchema, ChildBaseUpdateSchema, ChildPhysicalInfoUpdate


class ChildController():
    @staticmethod
    async def create(data: ChildCreateSchema, auth_id: str, db: AsyncSession):
        pass
    
    
    @staticmethod
    async def detail(child_id: str, auth_id , db: AsyncSession):
        pass
    
    
    @staticmethod
    async def update_personal_info(id: str, data: ChildBaseUpdateSchema, auth_id: str, db: AsyncSession):
        pass
    
    
    @staticmethod
    async def update_physical_info(id: str, data: ChildPhysicalInfoUpdate, auth_id: str, db: AsyncSession):
        pass
        