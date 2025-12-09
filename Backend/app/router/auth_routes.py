from fastapi import APIRouter, Depends, Response, Cookie
from database.postgres import connect_db
from schemas.auth_schemas import UserCreateSchema, UserResponseSchema, UserLoginSchema
from sqlalchemy.ext.asyncio import AsyncSession
from controllers.auth_controllers import AuthController
from middleware.protect_endpoints import verify_authentication


auth_router = APIRouter(
    prefix='/api/auth',
    tags=['Authentication Routes']
)


@auth_router.post('/signup', status_code=201)
async def signup_route(res: Response, data: UserCreateSchema, db: AsyncSession = Depends(connect_db)):
    print('Hello bdas')
    return await AuthController.signup_func(data, db, res)
    


@auth_router.post('/login')
async def login_route(res: Response, data: UserLoginSchema, db: AsyncSession = Depends(connect_db)):
    return await AuthController.login_func(data, db, res)

    
@auth_router.post('/refresh-access-token')
async def refresh_token_route(refreshToken: str = Cookie(None)):
    return await AuthController.refresh_access_token_func(refreshToken)
  
  
@auth_router.post('/logout')
async def logout_route(res: Response, payload = Depends(verify_authentication)):
    return await AuthController.logout_user_func(res)


@auth_router.get('/authenticated-user')
async def authenticated_user_route(db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    id = payload['id']
    return await AuthController.authenticated_user_func(id, db)


from schemas.auth_schemas import ChangePassword


@auth_router.post('/password-reset')
async def reset_password(data: ChangePassword, db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    id = payload['id']
    return await AuthController.reset_password(data, id, db)