from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from uuid import UUID

from models.vaccination import VaccinationSchedule, VaccinationOption
from schemas.vaccination_schemas import VaccinationScheduleCreate

class VaccinationScheduleController:
    @staticmethod
    async def get_by_vaccine(vaccine_id: UUID, db: AsyncSession):
        try:
            stmt = select(VaccinationSchedule).where(VaccinationSchedule.vaccine_id == vaccine_id)
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
    async def create(data: VaccinationScheduleCreate, db: AsyncSession):
        try:
            # ensure vaccine exists
            vaccine = await db.get(VaccinationOption, data.vaccine_id)
            if not vaccine:
                raise HTTPException(status_code=404, detail='Vaccine option not found!')

            schedule = VaccinationSchedule(
                vaccine_id = data.vaccine_id,
                dose_num = data.dose_num,
                min_age_days = data.min_age_days,
                max_age_days = data.max_age_days
            )

            db.add(schedule)
            await db.commit()
            await db.refresh(schedule)
            return schedule

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
    async def update(schedule_id: UUID, data: VaccinationScheduleCreate, db: AsyncSession):
        try:
            schedule = await db.get(VaccinationSchedule, schedule_id)
            if not schedule:
                raise HTTPException(status_code=404, detail='Vaccination schedule not found!')

            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                if value is not None:
                    setattr(schedule, key, value)

            await db.commit()
            await db.refresh(schedule)
            return schedule

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
    async def get_all(db: AsyncSession):
        try:
            stmt = select(VaccinationSchedule)
            result = await db.execute(stmt)
            schedules = result.scalars().all()
            return schedules
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def delete(schedule_id: UUID, db: AsyncSession):
        try:
            schedule = await db.get(VaccinationSchedule, schedule_id)
            if not schedule:
                raise HTTPException(status_code=404, detail='Vaccination schedule not found!')

            await db.delete(schedule)
            await db.commit()
            return "Vaccination schedule deleted successfully!"

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
