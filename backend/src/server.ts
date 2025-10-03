import express from 'express';
import type { Request, Response, Application } from 'express';
import auth_router from './routes/auth_routes.js';
import dotenv from "dotenv";
import { connect_db } from './database/db.js';
import morgan from 'morgan';
import cookieParser from "cookie-parser";



const app: Application = express()
dotenv.config()
const PORT = process.env.PORT || 8080;


connect_db();


app.use(express.json());
app.use(cookieParser(process.env.SIGNING_SECRET || "my-secret"));
app.use('/api/auth', auth_router);
app.use(morgan('dev'));




app.get('/', (req: Request, res: Response) => {
  res.status(200).json("DASD")
  
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

