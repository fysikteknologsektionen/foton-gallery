import {loginUser, logoutUser} from '../controllers';
import {userValidators, validate} from '../validation';

import {Router} from 'express';

// Public endpoints
// eslint-disable-next-line new-cap
const authenticationRouter = Router();

authenticationRouter.post(
    '/',
    validate(userValidators, ['username', 'password']),
    loginUser,
);

authenticationRouter.delete('/', logoutUser);

export {authenticationRouter};
