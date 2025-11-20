from schemas.auth_schemas import UserCreateSchema, UserLoginSchema
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, Response
from sqlalchemy import select
from itsdangerous import Signer
from models.user import User
from utils.hash_services import hash_password_func, verify_password
from utils.token_services import generate_access_token, generate_refresh_token
from dotenv import load_dotenv # type: ignore
import os
from utils.token_services import verify_token
from jose.exceptions import JWTError, ExpiredSignatureError

from itsdangerous import URLSafeTimedSerializer
from utils.hash_services import hash_password_func
from utils.email_service import send_password_reset_email


serializer = URLSafeTimedSerializer(os.getenv("SIGNER_KEY"))


class AuthController():
    signer = Signer(os.getenv('SIGNER_KEY'))
    
    @staticmethod
    async def signup_func(data: UserCreateSchema, db: AsyncSession, res: Response):
        try:
            statement = select(User).where((User.email==data.email) | (User.username==data.username))
            
            result = await db.execute(statement)
                        
            user = result.scalar_one_or_none()
                        
            if user:
                raise HTTPException(status_code=400, detail='Email or username already exist!')
            
            hashed_password = hash_password_func(data.password)
            
            new_user = User(email=data.email, username=data.username, firstname=data.firstname, lastname=data.lastname, password=hashed_password)
                        
            db.add(new_user)
            
            await db.commit()
            
            await db.refresh(new_user)
            
            access_token = generate_access_token({'id': new_user.id})
            
            refresh_token =  generate_refresh_token({'id': new_user.id})
            
            signed_refresh_token = AuthController.signer.sign(refresh_token.encode()).decode()
            
            res.set_cookie(
                key='refreshToken', 
                value=signed_refresh_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60*60*24*7
            )
            return access_token
                                
        except SQLAlchemyError as e:
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
    async def login_func(data: UserLoginSchema, db: AsyncSession, res: Response):
        try:
            statement1 = select(User).where(User.email==data.email)
            
            result = await db.execute(statement1)
            
            exisiting_user = result.scalar_one_or_none()
            
            if not exisiting_user:
                raise HTTPException(status_code=404, detail='User does not exist!')
            
            is_match = verify_password(data.password, exisiting_user.password)
            
            if not is_match:
                raise HTTPException(status_code=400, detail='Incorrect password!')
            
            access_token = generate_access_token({'id': exisiting_user.id})
            
            refresh_token =  generate_refresh_token({'id': exisiting_user.id})
            
            signed_refresh_token = AuthController.signer.sign(refresh_token.encode()).decode()
            
            res.set_cookie(
                key='refreshToken', 
                value=signed_refresh_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60*60*24*7
            )
            return access_token
                
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f'Database error: {str(e)}')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
        
        
    @staticmethod
    async def refresh_access_token_func(refresh: str):
        try:
            if refresh == None:
                raise HTTPException(status_code=401, detail='You are not authorized to perform this task')
            
            unsigned_refresh_token = AuthController.signer.unsign(refresh.encode()).decode()
            
            payload = verify_token(unsigned_refresh_token, 'refresh')
                        
            if payload.get('type') == 'access':
                raise HTTPException(status_code=403, detail='Invalid token type!')
            
            new_access_token = generate_access_token({'id': payload.get('id')})
                        
            return  new_access_token
           
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Token has expired')
        
        except JWTError:
            raise HTTPException(status_code=403, detail='Invalid token')             
        
        except Exception as e:
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    
    @staticmethod
    async def logout_user_func(res: Response):
        res.delete_cookie("refreshToken")
        return {"message": "Logged out successfully"}
        
        
    @staticmethod 
    async def authenticated_user_func(auth_id: str, db: AsyncSession):
        try:
            statement = select(User.email, User.id, User.firstname, User.lastname, User.username, User.profile_pic).where(User.id==auth_id)
            
            result = await db.execute(statement)
            
            row = result.first()
        
            if row:
                email, user_id, firstname, lastname, username, profile_pic = row  
                
                return {
                    "email": email, 
                    "id": user_id, 
                    "firstname": firstname, 
                    "lastname": lastname, 
                    "username": username, 
                    "profile_pic": profile_pic 
                }
            
            raise HTTPException(status_code=404, detail='User not found!')
            
        except SQLAlchemyError:
            await db.rollback()
            
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
        
    @staticmethod
    async def forgot_password_func(data: ForgotPasswordSchema, db: AsyncSession):
        try:
            statement = select(User).where(User.email == data.email)
            result = await db.execute(statement)
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            # Create token valid for 30 mins
            token = serializer.dumps({"id": str(user.id)})

            # Send email
            send_password_reset_email(user.email, token)

            return {"message": "Password reset email sent"}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error sending reset email")


    @staticmethod
    async def reset_password_func(data: ResetPasswordSchema, db: AsyncSession):
        try:
            # Decode token
            try:
                payload = serializer.loads(data.token, max_age=1800)  # 30 minutes
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid or expired token")

            user_id = payload["id"]

            # Fetch user
            statement = select(User).where(User.id == user_id)
            result = await db.execute(statement)
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(status_code=404, detail="Invalid user")

            # Update password
            user.password = hash_password_func(data.new_password)
            await db.commit()

            return {"message": "Password updated successfully"}

        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Could not reset password")