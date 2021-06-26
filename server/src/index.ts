import { config } from './env';
import './db';
import express, { Application, json, Request, Response } from 'express';
import path from 'path';
import { albumRouter, authRouter, userRouter } from './routers';
import cookieParser from 'cookie-parser';

// Host & port configuration from .env file
const host: string = config.APP_HOST;
const port: number = Number(config.APP_PORT);

// Path to the frontend client
const clientDirectory: string = path.join(__dirname, '..', '..', 'client', 'build');

// Path to image directory 
const imageDirectory: string = path.join(__dirname, '..', 'images');

// Initialize express
const app: Application = express();

// Global middleware
app.use(cookieParser());
app.use(json());

// API routers
app.use('/api/album', albumRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static(clientDirectory));
app.use('/images', express.static(imageDirectory))

// Send unmatched requests to client
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientDirectory, 'index.html'));
});

// Listen to incoming requests
app.listen(port, host, () => {
  console.log(`Express listening on ${host}:${port}...`);
});