import {NextFunction, Response} from 'express';
import {Request, UserSession} from '../interfaces';

import {config} from '../config';
import jwt from 'jsonwebtoken';

/**
 * Middlware that populates the user field in the request
 * if an auth cookie is passed
 * @param req Express request object
 * @param res Express reponse object
 * @param next Express next function
 */
export function populateUserField(
    req: Request,
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
 * Middleware that authenticates a user by checking if the
 * req.user._id property is set
 * @param req Express request object
 * @param res Express reponse object
 * @param next Express next function
 */
export function authenticateUser(
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

/**
 * Middleware that authenticates an admin user by checking the
 * req.user.role property
 * @param req Express request object
 * @param res Express reponse object
 * @param next Express next function
 */
export function authenticateAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
  if (req.user?.role !== 'admin') {
    res.status(403).send();
    return;
  }
  next();
}
