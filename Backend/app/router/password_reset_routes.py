
from fastapi import APIRouter, Depends, Response
from database.db import connect_db
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.password_reset_schemas import ForgotPasswordRequest, ResetPasswordRequest
from controllers.password_reset_controller import PasswordResetController

password_router = APIRouter(
    prefix="/api/password",
    tags=["Password Reset"]
)


@password_router.post("/forgot", status_code=200)
async def forgot_password_route(data: ForgotPasswordRequest, db: AsyncSession = Depends(connect_db)):
    return await PasswordResetController.forgot_password_func(data.dict(), db)


@password_router.post("/reset", status_code=200)
async def reset_password_route(data: ResetPasswordRequest, db: AsyncSession = Depends(connect_db)):
    return await PasswordResetController.reset_password_func(data.dict(), db)
