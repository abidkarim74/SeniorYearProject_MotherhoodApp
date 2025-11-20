import os
from dotenv import load_dotenv  # type: ignore
from fastapi import HTTPException, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from imap_tools import MailBox  # type: ignore

from schemas.email_schemas import EmailCreateSchema
# from models.email_models import Email
from utils.email_service import send_email_background
from database.db import connect_db

load_dotenv()

IMAP_SERVER = "imap.gmail.com"
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


class EmailController:

    @staticmethod
    async def send_email(
        user_id: str,
        data: EmailCreateSchema,
        db: AsyncSession,
        background_tasks: BackgroundTasks
    ):
        # try:
        #     # Create email record
        #     new_email = Email(
        #         email_body=data.email_body,
        #         receiver_email=data.receiver_email,
        #         sender_id=user_id
        #     )

        #     db.add(new_email)
        #     await db.commit()
        #     await db.refresh(new_email)

            # Schedule background email sending
            background_tasks.add_task(
                send_email_background,
                f"password change",
                data.receiver_email,
                data.email_body
            )

            return {
                "message": f"Email to {data.receiver_email} is being sent in the background."
            }

        # except SQLAlchemyError:
        #     await db.rollback()
        #     raise HTTPException(status_code=500, detail="Database error!")

        # except Exception as e:
        #     await db.rollback()
        #     raise HTTPException(status_code=500, detail=str(e))
