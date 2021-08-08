import {NextFunction, Request, Response} from 'express';

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
    req: Request,
    res: Response,
    next: NextFunction,
): void {
  if (req.cookies.authToken) {
    jwt.verify(
        req.cookies.authToken,
        config.APP_SECRET,
        {},
        (error, decoded) => {
          if (error) {
            res.status(403).send();
            return;
          }
          req.user = decoded as Express.User;
        },
    );
  }
  next();
}

/**
 * Middleware that restricts a route to only authenicated users
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function restrictToAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
  if (!req.user) {
    res.status(403).send();
    return;
  }
  next();
}
