import {ValidationError as EVValidatorError} from 'express-validator';

/**
 * Generic error with a status field.
 */
export class StatusError extends Error {
  status: number;

  /**
   * @param message Error message
   * @param status Status code
   */
  constructor(message?: string, status?: number) {
    super(message);
    this.status = status ?? 400;
  }
}

/**
 * Error for when data validation fails.
 */
export class ValidationError extends StatusError {
  validationErrors: EVValidatorError[];

  /**
   * @param validatorErrors Validation errors
   * @param message Error message
   */
  constructor(validatorErrors: EVValidatorError[], message?: string) {
    super(message || 'Validation error', 422);
    this.name = 'ValidationError';
    this.validationErrors = validatorErrors;
  }
}

/**
 * Error for when resource cannot be found.
 */
export class NotFoundError extends StatusError {
  /**
   * @param message Error message
   */
  constructor(message?: string) {
    super(message || 'Not found', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Error for when user fails authentication.
 */
export class UnauthorizedError extends StatusError {
  /**
   * @param message Error message
   */
  constructor(message?: string) {
    super(message || 'Unauthorized', 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error for when user is not authorized to perform an action.
 */
export class ForbiddenError extends StatusError {
  /**
   * @param message Error message
   */
  constructor(message?: string) {
    super(message || 'Forbidden', 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Error for when the user tries to POST or PUT to a resource that already
 * exists.
 */
export class ConflictError extends StatusError {
  /**
   * @param message Error message
   */
  constructor(message?: string) {
    super(message || 'Conflict', 409);
    this.name = 'ConflictError';
  }
}
