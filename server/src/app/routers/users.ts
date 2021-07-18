import {createUser, deleteUser, updateUser} from '../controllers';
import {userValidators, validate} from '../validation';

import {Router} from 'express';
import {getUsers} from '../controllers/users';
import {restrictToAdmins} from '../middlewares';

// Private endpoints
// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.use(restrictToAdmins);

usersRouter.post(
    '/',
    validate(userValidators, ['username', 'password', 'role']),
    createUser,
);

usersRouter.patch(
    '/:id',
    validate(userValidators, ['id', 'username', 'optionalPassword', 'role']),
    updateUser,
);

usersRouter.get('/', getUsers);

usersRouter.delete('/:id', validate(userValidators, ['id']), deleteUser);

export {usersRouter};
