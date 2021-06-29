import {Router} from 'express';
import {check} from 'express-validator';
import {authController} from '../controllers';
import {checkValidationResult} from '../utils/checkValidationResult';

// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.post(
    '/login',
    check('email').isEmail().normalizeEmail(),
    check('password').notEmpty().escape(),
    checkValidationResult,
    authController.loginUser,
);

authRouter.delete(
    '/logout',
    authController.logoutUser,
);
