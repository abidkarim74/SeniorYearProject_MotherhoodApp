from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from uuid import UUID

from models.vaccination import VaccinationRecord, VaccinationOption, VaccinationSchedule
from models.child import Child
from schemas.vaccination_schemas import VaccinationRecordCreate, VaccinationRecordUpdate, VaccinationRecordResponse
from datetime import date


class VaccinationRecordController:
    @staticmethod
    async def _ensure_child_belongs_to_mother(auth_id: UUID, child_id: UUID, db: AsyncSession):
        child = await db.get(Child, child_id)
        if not child:
            raise HTTPException(status_code=404, detail='Child not found!')
        if str(child.mother_id) != str(auth_id):
            raise HTTPException(status_code=403, detail='Forbidden: child does not belong to authenticated user')
        return child

    @staticmethod
    async def _ensure_vaccine_exists(vaccine_id: UUID, db: AsyncSession):
        vaccine = await db.get(VaccinationOption, vaccine_id)
        if not vaccine:
            raise HTTPException(status_code=404, detail='Vaccine option not found!')
        return vaccine

    @staticmethod
    async def _ensure_schedule_exists(schedule_id: UUID | None, db: AsyncSession):
        if schedule_id is None:
            return None
        schedule = await db.get(VaccinationSchedule, schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail='Vaccination schedule not found!')
        return schedule

    @staticmethod
    async def get_child_records(auth_id: UUID, child_id: UUID, db: AsyncSession):
        try:
            await VaccinationRecordController._ensure_child_belongs_to_mother(auth_id, child_id, db)
            
            stmt = select(VaccinationRecord).where(VaccinationRecord.child_id == child_id)
            result = await db.execute(stmt)
            records = result.scalars().all()
            
            response_records = []
            for record in records:
                status_value = record.status.value if hasattr(record.status, 'value') else str(record.status)
                
                response_records.append(VaccinationRecordResponse(
                    id=record.id,
                    child_id=record.child_id,
                    vaccine_id=record.vaccine_id,
                    schedule_id=record.schedule_id,
                    dose_num=record.dose_num,
                    date_given=record.date_given,
                    status=status_value.upper()
                ))
            return response_records

        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Internal server error!')

    @staticmethod
    async def create(auth_id: UUID, data: VaccinationRecordCreate, db: AsyncSession):
        try:
            await VaccinationRecordController._ensure_child_belongs_to_mother(auth_id, data.child_id, db)
            await VaccinationRecordController._ensure_vaccine_exists(data.vaccine_id, db)
            await VaccinationRecordController._ensure_schedule_exists(data.schedule_id, db)

            if data.date_given is not None and data.date_given > date.today():
                raise HTTPException(status_code=400, detail='date_given cannot be in the future')
            
            new_record = VaccinationRecord(
                child_id=data.child_id,
                vaccine_id=data.vaccine_id,
                schedule_id=data.schedule_id,
                dose_num=data.dose_num,
                date_given=data.date_given,
                status=data.status.value.upper(), 
            )

            db.add(new_record)
            await db.commit()
            
            return VaccinationRecordResponse(
                id=new_record.id,
                child_id=new_record.child_id,
                vaccine_id=new_record.vaccine_id,
                schedule_id=new_record.schedule_id,
                dose_num=new_record.dose_num,
                date_given=new_record.date_given,
                status=new_record.status
            )

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Internal server error!')

    @staticmethod
    async def update(auth_id: UUID, record_id: UUID, data: VaccinationRecordUpdate, db: AsyncSession):
        try:
            record = await db.get(VaccinationRecord, record_id)
            if not record:
                raise HTTPException(status_code=404, detail='Vaccination record not found!')

            await VaccinationRecordController._ensure_child_belongs_to_mother(auth_id, record.child_id, db)

            update_data = data.model_dump(exclude_unset=True)
            
            if 'date_given' in update_data and update_data['date_given'] is not None:
                if update_data['date_given'] > date.today():
                    raise HTTPException(status_code=400, detail='date_given cannot be in the future')

            if 'status' in update_data and update_data['status'] is not None:
                status_value = update_data['status']
                if hasattr(status_value, 'value'):
                    update_data['status'] = status_value.value.upper()
                else:
                    update_data['status'] = str(status_value).upper()

            for key, value in update_data.items():
                if value is not None:
                    setattr(record, key, value)

            await db.commit()

            return VaccinationRecordResponse(
                id=record.id,
                child_id=record.child_id,
                vaccine_id=record.vaccine_id,
                schedule_id=record.schedule_id,
                dose_num=record.dose_num,
                date_given=record.date_given,
                status=record.status
            )

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Internal server error!')

    @staticmethod
    async def delete(auth_id: UUID, record_id: UUID, db: AsyncSession):
        try:
            record = await db.get(VaccinationRecord, record_id)
            if not record:
                raise HTTPException(status_code=404, detail='Vaccination record not found!')

            await VaccinationRecordController._ensure_child_belongs_to_mother(auth_id, record.child_id, db)

            await db.delete(record)
            await db.commit()
            return "Vaccination record deleted successfully!"

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Internal server error!')