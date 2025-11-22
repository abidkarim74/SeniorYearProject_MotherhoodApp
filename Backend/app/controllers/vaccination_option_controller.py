from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from uuid import UUID

from models.vaccination import VaccinationOption
from schemas.vaccination_schemas import VaccinationOptionCreate

class VaccinationOptionController:
    @staticmethod
    async def get_all(db: AsyncSession):
        try:
            stmt = select(VaccinationOption)
            result = await db.execute(stmt)
            items = result.scalars().all()
            return items

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
    async def create(data: VaccinationOptionCreate, db: AsyncSession):
        try:
            # check uniqueness by name
            stmt = select(VaccinationOption).where(VaccinationOption.vaccine_name == data.vaccine_name)
            result = await db.execute(stmt)
            existing = result.scalars().first()
            if existing:
                raise HTTPException(status_code=400, detail='Vaccine with this name already exists!')

            option = VaccinationOption(
                vaccine_name = data.vaccine_name,
                description = data.description,
                protect_against = data.protect_against,
                doses_needed = data.doses_needed,
                is_mandatory = data.is_mandatory
            )

            db.add(option)
            await db.commit()
            await db.refresh(option)
            return option

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    @staticmethod
    async def update(option_id: UUID, data: VaccinationOptionCreate, db: AsyncSession):
        try:
            option = await db.get(VaccinationOption, option_id)
            if not option:
                raise HTTPException(status_code=404, detail='Vaccination option not found!')

            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                if value is not None:
                    setattr(option, key, value)

            await db.commit()
            await db.refresh(option)
            return option

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    @staticmethod
    async def delete(option_id: UUID, db: AsyncSession):
        try:
            option = await db.get(VaccinationOption, option_id)
            if not option:
                raise HTTPException(status_code=404, detail='Vaccination option not found!')

            await db.delete(option)
            await db.commit()
            return "Vaccination option deleted successfully!"

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
