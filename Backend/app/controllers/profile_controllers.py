from sqlalchemy.ext.asyncio import AsyncSession
from database.db import connect_db
from fastapi import HTTPException
from schemas.profile_schemas import MotherProfileUpdate
from sqlalchemy.exc import SQLAlchemyError
from models.user import User
from sqlalchemy import select, inspect
from uuid import UUID
from typing import Dict, Any, Optional
from models.child import Child



class ProfileController():
    @staticmethod
    async def detail(id: UUID, db: AsyncSession) -> Dict[str, Any]:
        try:
            columns = [column for column in inspect(User).c if column.name != "password"]
            statement = select(*columns).where(User.id==id)
            
            result = await db.execute(statement)
            row = result.first()
                        
            if row:
                row_dict = dict(row._mapping) 
                row_dict.pop("password", None)
                
                return row_dict
            
            else:
                raise HTTPException(status_code=404, detail='User not found!')
                    
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Database error!')

        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
        
    
    @staticmethod
    async def update(auth_id: str, data: MotherProfileUpdate, db: AsyncSession):
        try:
            user = await db.get(User, auth_id)
            
            if not user:
                raise HTTPException(status_code=404, detail='User not found!')
            
            update_data = data.model_dump(exclude_unset=True)

            for key, value in update_data.items():
                if value != None:
                    setattr(user, key, value)
            
            await db.commit()
            await db.refresh(user)
                           
            return user
        
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Database error!')
            
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
            
    
    @staticmethod
    async def delete(auth_id: str, db: AsyncSession):
        try:
            user = await db.get(User, auth_id)
            
            if user:
                await db.delete(user)
                await db.commit()
                
                return "User profile delete successfully!"
            
            raise HTTPException(status_code=404, detail='User profile not found!')
        
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Database error!')

        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
            
    
    @staticmethod
    async def get_children(auth_id: UUID, db: AsyncSession):
        try:
            stmt = select(
                Child.id,
                Child.firstname,
                Child.lastname,
                Child.profile_pic,
                Child.gender,
                Child.date_of_birth
                
            ).where(Child.mother_id==auth_id)
            
            result = await db.execute(stmt)
            children = result.all()
            
            return children
        
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Database error!')

        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
        