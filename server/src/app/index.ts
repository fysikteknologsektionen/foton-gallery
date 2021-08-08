import {albumsRouter, authenticationRouter} from './routers';
import {config, passport} from '../config';
import express, {json} from 'express';

import cookieParser from 'cookie-parser';
import {errorHandler} from './errors';
import helmet from 'helmet';
import path from 'path';

// Constants
const clientPath = path.join(__dirname, '..', '..', '..', 'client', 'build');
const imagesPath = path.join(__dirname, '..', '..', 'images');
const app = express();

// Global middlewares
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'img-src': ['\'self\'', '*.googleusercontent.com'],
      },
    }),
);
app.use(cookieParser());
app.use(json());
app.use(passport.initialize());

// API routers
app.use('/api/albums', albumsRouter);
app.use('/api/auth', authenticationRouter);

// Static files
app.use(express.static(clientPath));
app.use('/images', express.static(imagesPath));

// Send unmatched requests to client
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Register error handler
app.use(errorHandler);

// Start server
app.listen(config.APP_PORT, config.APP_HOST, () => {
  console.log(`Express listening on ${config.APP_HOST}:${config.APP_PORT}...`);
});
