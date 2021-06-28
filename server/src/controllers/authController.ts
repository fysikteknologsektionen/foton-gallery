import {config} from '../env';
import {NextFunction, Request, Response} from 'express';
import {UserModel} from '../models';
import {User, UserSession} from '../interfaces';
import jwt from 'jsonwebtoken';
import {matchedData} from 'express-validator';

/**
 * Logs in a user by checking request, creating a secure token and settings cookies with credentials
 * @param {Request} req - Express request object containing email and password
 * @param {Response} res - Express reponse object
 * @param {NextFunction} next - Express next function
 */
export async function loginUser(req: Request, res: Response, next: NextFunction) {
  const {email, password} = matchedData(req) as {email: string, password: string};
  try {
    const user: User | null = await UserModel.findOne({email: email}).exec();
    if (!user || await user.comparePassword(password)) {
      res.status(401).send();
      return;
    }
    const session: UserSession = {id: user._id, isAdmin: user.isAdmin};
    // jwt does not return promise so have to do with callback
    jwt.sign(session, config.APP_SECRET, {expiresIn: '3h'}, (error, token) => {
      if (error) {
        throw error;
      }
      res.cookie('auth', token, {httpOnly: true, sameSite: 'strict', secure: true}); // Cookie used for authentication (secure)
      res.cookie('user', JSON.stringify(session), {sameSite: 'strict', secure: true}); // Cookie used by front end (not secure)
      res.send();
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logs out a user by clearing the credential cookies
 * @param {Request} req - Express request object
 * @param {Response} res - Express reponse object
 * @param {NextFunction} next - Express next function
 */
export function logoutUser(req: Request, res: Response, next: NextFunction) {
  res.clearCookie('auth', {httpOnly: true, sameSite: 'strict', secure: true});
  res.clearCookie('user', {sameSite: 'strict', secure: true});
  res.status(205).send();
}

/**
 * Tries to populates the user field in the request if an auth cookie is passed
 * @param {Request} req - Express request object
 * @param {string | undefined} req.cookies.auth - Authentication cookie containing a stringified user object
 * @param {Response} res - Express reponse object
 * @param {NextFunction} next - Express next function
 */
export function populateUserField(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.auth) {
    // jwt does not return promise so have to do with callback
    jwt.verify(req.cookies.auth, config.APP_SECRET, {}, (error, decoded) => {
      if (error) {
        res.status(403).send();
        return;
      }
      // Attach UserInfo object to request to allow future middleware to access it
      req.user = decoded as UserSession;
    });
  }
  next();
}

/**
 * Authenticates a user by checking if the req.user.id property is set
 * @param {Request} req - Express request object
 * @param {string | undefined} req.user.id - ID of the user
 * @param {Response} res - Express reponse object
 * @param {NextFunction} next - Express next function
 */
export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.id) {
    res.status(403).send();
    return;
  }
  next();
}

/**
 * Authenticates an admin user by checking if the req.user.isAdmin property is set and is true
 * @param {Request} req - Express request object
 * @param {boolean} req.user.isAdmin - Whether the user is an admin or not
 * @param {Response} res - Express reponse object
 * @param {NextFunction} next - Express next function
 */
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    res.status(403).send();
    return;
  }
  next();
}
