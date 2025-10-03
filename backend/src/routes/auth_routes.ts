import { Router } from "express";
import { user_signup, user_login, refresh_token, auth_user } from "../controllers/auth_controllers.js";


const auth_router = Router()


auth_router.post('/signup', user_signup);
auth_router.post('/login', user_login);
auth_router.get('/auth-user', auth_user);
auth_router.post('/refresh-token', refresh_token);


export default auth_router;