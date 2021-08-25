import {clearCookies, generateToken, generateRefreshToken, refreshTokens} from '../controllers';

import {Router} from 'express';
import passport from 'passport';

// Public endpoints
// eslint-disable-next-line new-cap
const authenticationRouter = Router();

authenticationRouter.get(
    '/google',
    passport.authenticate('google', {scope: ['profile', 'email']}),
);

authenticationRouter.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: '/unauthorized'}),
    generateRefreshToken,
    generateToken
);

authenticationRouter.get(
    '/refreshtoken',
    refreshTokens,
    generateRefreshToken,
    generateToken
)

authenticationRouter.delete('/logout', clearCookies);

export {authenticationRouter};
