import {authenticateAdmin, authenticateUser} from '../middleware';

import {Router} from 'express';
import {check} from 'express-validator';
import {checkValidationResult} from '../middleware';
import {userController} from '../controllers';

// Private endpoints
// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.use(authenticateUser);
usersRouter.use(authenticateAdmin);

const usersValidationChain = [
  check('username').notEmpty().escape().trim(),
  check('password').notEmpty().escape().trim(),
  check('role')
      .notEmpty()
      .escape()
      .trim()
      .custom((value) => {
        if (!['user', 'admin'].includes(value)) {
          throw new Error('Invalid user role');
        }
      }),
];

usersRouter.post(
    '/',
    usersValidationChain,
    checkValidationResult,
    userController.createUser,
);

usersRouter.put(
    '/:id',
    check('id').notEmpty().isAlphanumeric(),
    usersValidationChain,
    checkValidationResult,
    userController.updateUser,
);

usersRouter.get('/', userController.getUsers);

usersRouter.delete(
    '/:id',
    check('id').notEmpty().isAlphanumeric(),
    checkValidationResult,
    userController.deleteUser,
);

export {usersRouter};
