import {NextFunction, Request, Response} from 'express';

import {config} from '../../config';
import {RefreshToken} from '../models'
import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';

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
    const refreshDuration = 60 * 60 * 24 * 7;
    const tokenString = cryptoRandomString({length: 20});
    const refreshToken = new RefreshToken({
      token: tokenString,
      user: req.user,
      expiryDate: Date.now() + refreshDuration,
    });
    refreshToken.save();
    // Cookie used for refreshing authentication token
    res.cookie('refreshToken', tokenString, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: refreshDuration,
    });
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
  next: NextFunction
): Promise<void> {
  try {
    if (!req.cookies.refreshToken) {
      res.status(403).send();
      return;
    }
    const refreshToken = RefreshToken.findOne({token: req.cookies.refreshToken});
    if (!refreshToken) {
      res.status(403).send();
      return;
    }
    if (!refreshToken.verifyToken()) {
      RefreshToken.findByIdAndDelete(refreshToken._id);
      res.status(403).send();
      return;
    }
    req.user = refreshToken.user;
    // Rotate refresh token in database
    await RefreshToken.findByIdAndDelete(refreshToken._id);
    next();
  } catch(error) {
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
