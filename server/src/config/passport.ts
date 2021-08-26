import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {config} from './config';
import passport from 'passport';
import urljoin from 'url-join';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
  done(null, obj);
});

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
            const email = profile.emails?.[0]?.value;
            if (!email || !new RegExp(config.EMAIL_REGEXP).test(email)) {
              done(null, undefined);
              return;
            }
            const user: Express.User = {
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            };
            done(null, user);
          } catch (error) {
            done(error);
          }
        },
    ),
);

export {passport};
