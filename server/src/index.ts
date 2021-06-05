import './env'
import express, { Application, Request, Response } from 'express';
import path from 'path';
import { AlbumRouter } from './routers';

// Host & port configuration from .env file
const host: string = process.env.APP_HOST ?? 'localhost';
const port: number = Number(process.env.APP_PORT ?? 3000);

// Path to the frontend client
const clientDirectory: string = path.join(__dirname, '..', '..', 'client', 'build');

// Initialize express
const app: Application = express();

// Global middleware

// API routers
app.use('/album', AlbumRouter);

// Serve files in production
app.use(express.static(clientDirectory));

// Send unmatched requests to client
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientDirectory, 'index.html'));
});

// Listen to incoming requests
app.listen(port, host, () => {
  console.log(`Express listening on ${host}:${port}...`);
});