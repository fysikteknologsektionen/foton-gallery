import { Router } from 'express';
import { userController } from '../controllers';

export const userRouter: Router = Router();

userRouter.post('/', userController.createUser);
userRouter.delete('/', userController.deleteUser);