import {NextFunction, Request, Response} from 'express';

import {config} from '../../config';
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token, sets it as a cookie and redirects user
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function generateToken(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new Error('User is not deserialized.');
    }
    // Max session length in seconds
    const sessionLength = 0.5 * 60 * 60;
    jwt.sign(
        req.user,
        config.APP_SECRET,
        {expiresIn: sessionLength},
        (error, token) => {
          if (error) {
            throw error;
          }
          // Cookie used for authentication
          res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: sessionLength * 1000,
          });
          // Cookie used by front end (not secure)
          res.cookie('session', JSON.stringify(req.user), {
            sameSite: 'strict',
            secure: true,
            maxAge: sessionLength * 1000,
          });
          res.redirect('/');
        },
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Logs out user by clearing cookies
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function clearCookies(req: Request, res: Response): void {
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });
  res.clearCookie('session', {sameSite: 'strict', secure: true});
  res.status(205).send();
}
