import {ValidationError as EVValidatorError} from 'express-validator';

/**
 * Generic error with a status field.
 */
export class StatusError extends Error {
  status = 400;

  /**
   * @param message Error message
   */
  constructor(message?: string) {
    super(message);
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
    super(message || 'Validation error');
    this.name = 'ValidationError';
    this.status = 422;
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
    super(message || 'Not found');
    this.name = 'NotFoundError';
    this.status = 404;
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
    super(message || 'Unauthorized');
    this.name = 'UnauthorizedError';
    this.status = 401;
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
    super(message || 'Forbidden');
    this.name = 'ForbiddenError';
    this.status = 403;
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
    super(message || 'Conflict');
    this.name = 'ConflictError';
    this.status = 409;
  }
}
