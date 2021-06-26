import {Router} from 'express';
import {check} from 'express-validator';
import {authController, userController} from '../controllers';
import {checkValidationResult} from '../utils/checkValidationResult';

// eslint-disable-next-line new-cap
export const userRouter = Router();

/**
 * Middleware
 */
userRouter.use(authController.populateUserField);
userRouter.use(authController.authenticateUser);
userRouter.use(authController.authenticateAdmin);

/**
 * Endpoints
 */
userRouter.post(
    '/',
    check('email').isEmail().normalizeEmail(),
    check('password').notEmpty().escape().trim(),
    check('isAdmin').notEmpty().isBoolean().toBoolean(),
    checkValidationResult,
    userController.createUser,
);

userRouter.get(
    '/',
    userController.getUsers,
);

userRouter.delete(
    '/',
    check('id').notEmpty().isAlphanumeric(),
    checkValidationResult,
    userController.deleteUser,
);
