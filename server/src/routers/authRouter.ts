import { Router } from 'express';
import { check } from 'express-validator';
import { authController } from '../controllers';
import { checkValidationResult } from '../utils';

export const authRouter: Router = Router();

/**
 * Endpoints
 */
authRouter.post(
  '/login',
  check('email').isEmail().normalizeEmail().escape(),
  check('password').notEmpty().escape(),
  checkValidationResult,
  authController.loginUser
);

authRouter.delete(
  '/logout',
  authController.logoutUser
);