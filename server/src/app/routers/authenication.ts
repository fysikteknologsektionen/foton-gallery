import {Router} from 'express';
import {generateToken} from '../controllers';
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
    generateToken,
    (req, res) => {
      res.redirect('/');
    },
);

export {authenticationRouter};
