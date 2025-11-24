# main.py
import os
from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import EmailStr
import aiosmtplib # type: ignore
from email.mime.text import MIMEText
from schemas.email_schemas import EmailCreateSchema
from sqlalchemy.ext.asyncio import AsyncSession
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv # type: ignore
from controllers.email_controllers import EmailController
from middleware.protect_endpoints import verify_authentication
from database.db import connect_db


load_dotenv()

email_router = APIRouter(
    prefix='/api/emails',
    tags=['Email Service']
)

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("EMAIL_USER")  # your email
SMTP_PASSWORD = os.getenv("EMAIL_PASS")  # your app password

async def send_email_background(
    subject: str, recipient: str, body: str
):
    message = MIMEMultipart()
    message["From"] = SMTP_USER
    message["To"] = recipient
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    await aiosmtplib.send(
        message,
        hostname=SMTP_SERVER,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
    )


@email_router.post("/send-email/")
async def send_email(data: EmailCreateSchema, background_tasks: BackgroundTasks, db: AsyncSession = Depends(connect_db), payload = Depends( verify_authentication)):
    user_id = payload['id']
    return await EmailController.send_email(user_id, data, db, background_tasks)