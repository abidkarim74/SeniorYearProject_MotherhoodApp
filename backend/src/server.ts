import express from 'express';
import type { Request, Response } from 'express';


const server = express()

server.get('/', (req: Request, res: Response) => {
  res.status(200).json("DASD")
  
})

server.listen(8000, 'localhost', () => {
  console.log('Server running at http://localhost:8000')
})

