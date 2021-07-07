import {Router} from 'express';
import {authController} from '../controllers';
import {check} from 'express-validator';
import {checkValidationResult} from '../middleware';

// Public endpoints
// eslint-disable-next-line new-cap
const authRouter = Router();

authRouter.post(
    '/',
    check('username').notEmpty().escape().trim(),
    check('password').notEmpty().escape().trim(),
    checkValidationResult,
    authController.loginUser,
);

authRouter.delete(
    '/',
    authController.logoutUser,
);

export {authRouter};
