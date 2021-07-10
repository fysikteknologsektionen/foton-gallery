import {NextFunction, Request, Response} from 'express';
import {StatusError, ValidationError} from './errors';

import {config} from '../../config';

/**
 * Custom error handler that handles client errors (status 4xx).
 * @param err Error object
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
  if (err instanceof StatusError) {
    res.status(err.status).json({
      error: {
        message: err.message,
        validation:
          err instanceof ValidationError ? err.validationErrors : undefined,
      },
    });
    // Do not log client errors in production
    if (config.NODE_ENV === 'development') {
      console.error(err);
    }
  } else {
    next(err);
  }
}
