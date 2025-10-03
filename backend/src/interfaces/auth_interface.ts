import { Request } from 'express';
import { promisify } from 'util';
import jwt, { JwtPayload } from 'jsonwebtoken';


export interface AuthenticatedUser {
  id: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const verifyAsync = promisify(jwt.verify) as (
  token: string,
  secret: string
) => Promise<JwtPayload>;


export interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
}