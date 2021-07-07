import {NextFunction, Response} from 'express';
import {Request, UserSession} from '../interfaces';

import {UserModel} from '../models';
import {config} from '../config';
import jwt from 'jsonwebtoken';
import {matchedData} from 'express-validator';

/**
 * Logs in a user and returns auth cookies if successful
 * @param req Express request object containing username and password
 * @param res Express reponse object
 * @param next Express next function
 */
export async function loginUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {username, password} = matchedData(req) as {
    username: string,
    password: string,
  };
  try {
    const user = await UserModel.findOne({username: username}).exec();
    if (!user || !await user.comparePassword(password)) {
      res.status(401).send();
      return;
    }
    const session: UserSession = {role: user.role};
    // Max session length in seconds
    const expires = 0.5*60*60;
    jwt.sign(session, config.APP_SECRET, {expiresIn: expires},
        (error, token) => {
          if (error) {
            throw error;
          }
          // Cookie used for authentication
          res.cookie('auth', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: expires*1000,
          });
          // Cookie used by front end (not secure)
          res.cookie('session', JSON.stringify(session), {
            sameSite: 'strict',
            secure: true,
            maxAge: expires*1000,
          });
          res.status(200).send();
        });
  } catch (error) {
    next(error);
  }
}

/**
 * Logs out a user by clearing cookies
 * @param req Express request object
 * @param res Express reponse object
 * @param next Express next function
 */
export function logoutUser(
    req: Request,
    res: Response,
): void {
  res.clearCookie('auth', {httpOnly: true, sameSite: 'strict', secure: true});
  res.clearCookie('session', {sameSite: 'strict', secure: true});
  res.status(205).send();
}
