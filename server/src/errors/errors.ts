import {ValidationError as ExpressValidationError} from 'express-validator';

/**
 * General HTTP error
 */
class HTTPError extends Error {
  name: string;
  statusCode: number;

  /**
   * @param message Error message
   * @param name Error name
   * @param statusCode HTTP error code to be sent to client
   */
  constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

/**
 * Error thrown in response to failed parameter validation
 */
export class ValidationError extends HTTPError {
  errors?: ExpressValidationError[];
  /**
   * @param message Error message
   * @param errors Array of validation errors
   */
  constructor(message: string, errors?: ExpressValidationError[]) {
    super(message, 'ValidationError', 400);
    this.errors = errors;
  }
}

/**
 * Error thrown in response to when requested resources cannot be found
 */
export class EntryNotFoundError extends HTTPError {
  /**
   * @param message Error message
   */
  constructor(message: string) {
    super(message, 'EntryNotFoundError', 404);
  }
}

/**
 * Error thrown in response to attempts to create a resource using the
 * same unique key as already existing resource
 */
export class DuplicateEntryError extends HTTPError {
  /**
   * @param message Error message
   */
  constructor(message: string) {
    super(message, 'DuplicateEntryError', 400);
  }
}
