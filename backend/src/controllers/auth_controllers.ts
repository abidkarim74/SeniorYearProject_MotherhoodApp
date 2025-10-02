import type { Request, Response } from "express";


export const user_signup = async (request: Request, res: Response) => {
  try {


  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error!' });
  }
}


export const user_login = async (req: Request, res: Response) => {
  try {

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error!' });
  }
}


export const auth_user = async (req: Request, res: Response) => {
  try {

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error!' });
  }
}


export const refresh_token = async (req: Request, res: Response) => {
  try {

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error!' });
  }
}