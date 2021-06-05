import { Router } from 'express';
import { UserController } from '../controllers';

export const UserRouter: Router = Router();

UserRouter.post('/', UserController.createUser);
UserRouter.delete('/', UserController.deleteUser);