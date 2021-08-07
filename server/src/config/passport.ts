import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {config} from './config';
import passport from 'passport';

passport.use(
    new GoogleStrategy(
        {
          clientID: config.GOOGLE_CLIENT_ID,
          clientSecret: config.GOOGLE_CLIENT_SECRET,
          callbackURL: '/auth/google/callback',
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            console.log(accessToken, refreshToken, profile);
          } catch (error) {
            done(error);
          }
        },
    ),
);

export {passport};
