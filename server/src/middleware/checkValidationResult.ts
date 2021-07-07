import {NextFunction, Response} from 'express';

import {Request} from '../interfaces';
import {ValidationError} from '../errors';
import {validationResult} from 'express-validator';

/**
 * Checks the Request object for validation errors and
 * returns with status 400 if it finds any
 * @param req Express request object to be screened for validation errors
 * @param res Express response object
 * @param next Express next function
 */
export function checkValidationResult(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: new ValidationError('Invalid fields.', errors.array()),
    });
    return;
  }
  next();
}
