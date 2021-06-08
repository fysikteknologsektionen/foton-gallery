import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

/**
 * Checks the Request object for validation errors and returns status 400 if it find any
 * @param {Request} req - Express Request object to be screened for validation errors
 */
export function checkValidationResult (req: Request, res: Response, next: NextFunction) {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}