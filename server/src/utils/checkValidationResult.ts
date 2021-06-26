import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';

/**
 * Checks the Request object for validation errors and returns status 400 if it finds any
 * @param {Request} req - Express request object to be screened for validation errors
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export function checkValidationResult(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({errors: errors.array()});
    return;
  }
  next();
}
