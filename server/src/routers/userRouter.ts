import {authController, userController} from '../controllers';

import {Router} from 'express';
import {check} from 'express-validator';
import {checkValidationResult} from '../utils/checkValidationResult';

// eslint-disable-next-line new-cap
export const userRouter = Router();

userRouter.use(authController.authenticateUser);
userRouter.use(authController.authenticateAdmin);

userRouter.post(
    '/',
    check('username').notEmpty().escape().trim(),
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
