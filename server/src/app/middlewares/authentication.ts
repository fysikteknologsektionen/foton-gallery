import {NextFunction, Response} from 'express';
import {RequestWithUser, UserSession} from '../../interfaces';

import {config} from '../../config';
import jwt from 'jsonwebtoken';

/**
 * Middlware that populates the user field of the request object if an auth
 * cookie is passed
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function populateUserField(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
): void {
  if (req.cookies.auth) {
    jwt.verify(req.cookies.auth, config.APP_SECRET, {}, (error, decoded) => {
      if (error) {
        res.status(403).send();
        return;
      }
      req.user = decoded as UserSession;
    });
  }
  next();
}

/**
 * Middleware that restricts a route to only authenicated users
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function restrictToUsers(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
): void {
  if (!req.user) {
    res.status(403).send();
    return;
  }
  next();
}

/**
 * Middleware that restricts a route to only authenticated admin users
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function restrictToAdmins(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
): void {
  if (req.user?.role !== 'admin') {
    res.status(403).send();
    return;
  }
  next();
}
