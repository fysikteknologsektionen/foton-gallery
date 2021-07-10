import {NextFunction, Request, Response} from 'express';
import {UserAuthenicationData, UserSession} from '../../interfaces';

import {UnauthorizedError} from '../errors';
import {User} from '../models';
import bcrypt from 'bcrypt';
import {config} from '../../config';
import jwt from 'jsonwebtoken';
import {matchedData} from 'express-validator';

/**
 * Logs in user and returns cookies with JWT token and session
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function loginUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {username, password} = matchedData(req) as UserAuthenicationData;
  try {
    const user = await User.findOne({username: username}).exec();
    if (!user) {
      throw new UnauthorizedError();
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedError();
    }

    // Max session length in seconds
    const sessionLength = 0.5 * 60 * 60;
    const session: UserSession = {role: user.role};
    jwt.sign(
        session,
        config.APP_SECRET,
        {expiresIn: sessionLength},
        (error, token) => {
          if (error) {
            throw error;
          }
          // Cookie used for authentication
          res.cookie('auth', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: sessionLength * 1000,
          });
          // Cookie used by front end (not secure)
          res.cookie('session', JSON.stringify(session), {
            sameSite: 'strict',
            secure: true,
            maxAge: sessionLength * 1000,
          });
          res.status(200).send();
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
export function logoutUser(req: Request, res: Response): void {
  res.clearCookie('auth', {httpOnly: true, sameSite: 'strict', secure: true});
  res.clearCookie('session', {sameSite: 'strict', secure: true});
  res.status(205).send();
}
