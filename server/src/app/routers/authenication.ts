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
    (req, res) => {
      res.redirect('/');
    },
);

export {authenticationRouter};
