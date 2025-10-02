import express from 'express';
import type { Request, Response } from 'express';
import auth_router from './routes/auth_routes.js';


const server = express()


server.use('/api/auth', auth_router);



server.get('/', (req: Request, res: Response) => {
  res.status(200).json("DASD")
  
})

server.listen(8000, 'localhost', () => {
  console.log('Server running at http://localhost:8000')
})

