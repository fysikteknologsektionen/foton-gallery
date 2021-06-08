import { Router } from 'express';
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
userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getUsers);
userRouter.delete('/', userController.deleteUser);