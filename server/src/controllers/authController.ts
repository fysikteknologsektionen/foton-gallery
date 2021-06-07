import { config } from '../env';
import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models';
import { User, UserInfo } from '../types';
import jwt from 'jsonwebtoken';

/**
 * Logs in a user by checking request, creating a secure token and settings cookies with credentials
 * @param {string} req.body.email - Email for attempted login
 * @param {string} req.body.password - Password for attempted login
 */
export async function loginUser (req: Request, res: Response, next: NextFunction) {
  const { email, password }: { email: string, password: string} = req.body;
  try {
    const user: User | null = await UserModel.findOne({ email: email }).exec();
    if (!user || await user.comparePassword(password)) {
      res.status(401).send();
      return;
    }
    const userInfo: UserInfo = { id: user._id, isAdmin: user.isAdmin };
    // jwt does not return promise so have to do with callback
    jwt.sign(userInfo, config.APP_SECRET, { expiresIn: '3h' }, (error, token) => {
      if (error)
        throw error;
      res.cookie('auth', token, { httpOnly: true, sameSite: 'strict', secure: true }); // Cookie used for authentication (secure)
      res.cookie('user', JSON.stringify(userInfo), { sameSite: 'strict', secure: true }); // Cookie used by front end (not secure)
      res.send();
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logs out a user by clearing the credential cookies
 */
export function logoutUser (req: Request, res: Response, next: NextFunction) {
  res.clearCookie('auth', { httpOnly: true, sameSite: 'strict', secure: true });
  res.clearCookie('user', { sameSite: 'strict', secure: true });
  res.status(205).send();
}

/**
 * Tries to populates the user field in the request if an auth cookie is passed
 * @param {string} req.cookies.auth - The auth cookie containing a stringified @type {UserInfo} instance
 */
export function populateUserField (req: Request, res: Response, next: NextFunction) {
  if (req.cookies.auth) {
    // jwt does not return promise so have to do with callback
    jwt.verify(req.cookies.auth, config.APP_SECRET, {}, (error, decoded) => {
      if (error) {
        res.status(403).send();
        return;
      }
      // Attach UserInfo object to request to allow future middleware to access it
      req.user = decoded as UserInfo;
    });
  }
  next();
}

/**
 * Authenticates a user by checking if the req.user.id property is set
 * @param {string} req.user.id - Id that is set if the user is authenticated
 */
export function authenticateUser (req: Request, res: Response, next: NextFunction) {
  if (!req.user?.id) {
    res.status(403).send();
    return;
  }
  next();
}

/**
 * Authenticates a user by checking if the req.user.isAdmin property is set and is true
 * @param {boolean} req.user.isAdmin - Boolean value if the user is an admin or not
 */
export function authenticateAdmin (req: Request, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    res.status(403).send();
    return;
  }
  next();
}