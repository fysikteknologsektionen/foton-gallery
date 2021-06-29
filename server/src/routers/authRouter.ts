import {Router} from 'express';
import {check} from 'express-validator';
import {authController} from '../controllers';
import {checkValidationResult} from '../utils/checkValidationResult';

// Public endpoints
// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.post(
    '/',
    check('email').isEmail().normalizeEmail(),
    check('password').notEmpty().escape().trim(),
    checkValidationResult,
    authController.loginUser,
);

authRouter.delete(
    '/',
    authController.logoutUser,
);
