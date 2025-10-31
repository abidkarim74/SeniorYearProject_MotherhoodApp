from sqlalchemy.ext.asyncio import AsyncSession
from database.db import connect_db
from schemas.profile_schemas import MotherProfileUpdate


class ProfileControllers():
    @staticmethod
    async def detail(id: str, db: AsyncSession):
        pass
    
    
    @staticmethod
    async def update(auth_id: str, data: MotherProfileUpdate, db: AsyncSession):
        pass
    
    
    @staticmethod
    async def delete(auth_id: str, db: AsyncSession):
        pass