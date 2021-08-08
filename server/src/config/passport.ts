import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {UnauthorizedError} from '../app/errors';
import {config} from './config';
import passport from 'passport';
import urljoin from 'url-join';

passport.use(
    new GoogleStrategy(
        {
          clientID: config.GOOGLE_CLIENT_ID,
          clientSecret: config.GOOGLE_CLIENT_SECRET,
          callbackURL: urljoin(config.APP_URL, '/api/auth/google/callback'),
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0].value;
            if (!email) {
              throw new UnauthorizedError();
            }
            const role = new RegExp(config.USER_REGEXP).test(email) ?
          'user' :
          new RegExp(config.ADMIN_REGEXP).test(email) ?
          'admin' :
          undefined;
            if (!role) {
              throw new UnauthorizedError();
            }
            const session = {
              id: profile.id,
              role: role,
            };
            done(null, session);
          } catch (error) {
            done(error);
          }
        },
    ),
);

export {passport};
