from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from models.user import User
from fastapi import HTTPException, status
from utils.password_reset_token_service import generate_password_reset_token, verify_password_reset_token
from utils.email_service import send_email_background
from utils.hash_services import hash_password_func
from typing import Dict
from uuid import UUID as UUID_type

class PasswordResetController:
    @staticmethod
    async def forgot_password_func(data: Dict, db: AsyncSession):
        """
        data: {"email": "<email>"}
        """
        email = data.get("email")
        if not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is required")

        q = await db.execute(select(User).where(User.email == email))
        user = q.scalar_one_or_none()
        if not user:
            return {"msg": "If that email exists in our system, you will receive password reset instructions."}

        payload = {"id": str(user.id)}
        token = generate_password_reset_token(payload)
     
        send_password_reset_email(user.email, token)

        return {"msg": "If that email exists in our system, you will receive password reset instructions."}

    @staticmethod
    async def reset_password_func(data: Dict, db: AsyncSession):
        """
        data: {"token": "<token>", "new_password": "<password>"}
        """
        token = data.get("token")
        new_password = data.get("new_password")

        if not token or not new_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token and new_password are required")

        decoded = verify_password_reset_token(token)
        user_id_str = decoded.get("id")
        if not user_id_str:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload")

        try:
            user_id = UUID_type(user_id_str)
        except Exception:
           
            user_id = user_id_str

        q = await db.execute(select(User).where(User.id == user_id))
        user = q.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        hashed = hash_password_func(new_password)

        await db.execute(
            update(User).
            where(User.id == user_id).
            values({"password": hashed})
        )
        await db.commit()

        return {"msg": "Password has been reset successfully. You can now log in with your new password."}