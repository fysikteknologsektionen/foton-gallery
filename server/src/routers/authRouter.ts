import { Router } from 'express';
import { authController } from '../controllers';

export const authRouter: Router = Router();

/**
 * Endpoints
 */
authRouter.post('/login', authController.loginUser);
authRouter.delete('/logout', authController.logoutUser);