import { config } from './env';
import './db';
import express, { Application, Request, Response } from 'express';
import path from 'path';
import { albumRouter, authRouter, userRouter } from './routers';
import cookieParser from 'cookie-parser';

// Host & port configuration from .env file
const host: string = config.APP_HOST;
const port: number = Number(config.APP_PORT);

// Path to the frontend client
const clientDirectory: string = path.join(__dirname, '..', '..', 'client', 'build');

// Initialize express
const app: Application = express();

// Global middleware
app.use(cookieParser());

// API routers
app.use('/album', albumRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

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