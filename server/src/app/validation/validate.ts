import {NextFunction, Request, Response} from 'express';

import {ValidationError} from '../errors';
import {albumValidators} from './album';
import {validationResult} from 'express-validator';

/**
 * Middleware that checks for errors in validation result.
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
function checkValidationResult(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(new ValidationError(errors.array()));
  }
}

/**
 * Generates a validation chain and checks validation results
 * @param validatorObject Validator object to use
 * @param fields Fields to scheck
 * @returns Validation chain and checkValidationResult
 */
export function validate<T extends typeof albumValidators>(
    validatorObject: T,
    fields: Array<keyof T>,
): (
  | T[keyof T]
  | ((req: Request, res: Response, next: NextFunction) => void)
)[] {
  const validators = fields.map((field) => validatorObject[field]);
  return [...validators, checkValidationResult];
}
