import {NextFunction, Request, Response} from 'express';

import {RefreshToken} from '../models';
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
    const sessionLength = config.AUTH_DURATION;
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
 * Generates a refresh token and sets it as a cookie
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function generateRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new Error('User is not deserialized.');
    }
    // Refresh token duration in seconds
    const refreshDuration = config.REFRESH_DURATION;
    jwt.sign(
        req.user,
        config.APP_SECRET,
        {expiresIn: refreshDuration},
        (error, token) => {
          if (error) {
            throw error;
          }
          // Cookie used for refresh token
          res.cookie('refreshToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: refreshDuration * 1000,
          });
          // Save refresh token to database
          const refreshToken = new RefreshToken({
            jwtToken: token,
          });
          refreshToken.save();
        },
    );
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Generates a JWT token and a refresh token in exchange for a
 * valid refresh token
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function refreshTokens(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  try {
    if (!req.cookies.refreshToken) {
      res.status(401).send();
      return;
    }
    if (!RefreshToken.findOne({jwtToken: req.cookies.refreshToken})) {
      res.status(401).send();
      return;
    }
    jwt.verify(
        req.cookies.refreshToken,
        config.APP_SECRET,
        // here ts complains about implicit 'any'
        // but not in callback of jwt.sign
        (error: any, decoded: any) => {
          if (error || !decoded) {
          // more specific error handling?
            RefreshToken.deleteOne({jwtToken: req.cookies.refreshToken});
            res.status(401).send();
            return;
          }
          // Extract user from jwt
          req.user = decoded.user;
          // Rotate refresh token
          RefreshToken.deleteOne({jwtToken: req.cookies.refreshToken});
          next();
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
 */
export function clearCookies(req: Request, res: Response): void {
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });
  res.clearCookie('session', {sameSite: 'strict', secure: true});
  if (req.cookies.refreshToken) {
    RefreshToken.findOneAndDelete({token: req.cookies.refreshToken});
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
  }
  res.status(205).send();
}
