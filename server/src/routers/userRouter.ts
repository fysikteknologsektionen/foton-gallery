import { Router } from 'express';
import { check } from 'express-validator';
import { authController, userController } from '../controllers';

export const userRouter: Router = Router();

/**
 * Middleware
 */
 userRouter.use(authController.populateUserField);
 userRouter.use(authController.authenticateUser);
 userRouter.use(authController.authenticateAdmin)
 
/**
 * Endpoints
 */
userRouter.post(
  '/',
  check('email').isEmail().normalizeEmail().escape(),
  check('password').notEmpty().escape(),
  check('isAdmin').notEmpty().isBoolean(),
  userController.createUser
);

userRouter.get(
  '/',
  userController.getUsers
);

userRouter.delete(
  '/',
  check('id').notEmpty().isString().escape(),
  userController.deleteUser
);