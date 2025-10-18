import { Router } from "express";
import { user_signup, user_login, refresh_token, auth_user, logout_user } from "../controllers/auth_controllers.js";
import { verify_authentication } from "../middleware/auth_middleware.js";


const auth_router = Router()


auth_router.post('/signup', user_signup);
auth_router.post('/login', user_login);
auth_router.get('/auth-user', verify_authentication, auth_user);
auth_router.post('/refresh-token', refresh_token);
auth_router.post('/logout', verify_authentication, logout_user);


export default auth_router;