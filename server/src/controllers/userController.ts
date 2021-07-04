import {NextFunction, Request, Response} from 'express';

import {User} from '../interfaces';
import {UserModel} from '../models';
import {matchedData} from 'express-validator';

/**
 * Creates a new user from username/password
 * @param req Express request object containing username, password and admin status
 * @param res Express response object
 * @param next Express next function
 */
export async function createUser(req: Request, res: Response, next: NextFunction) {
  const data = matchedData(req) as Partial<User>;
  try {
    const user = new UserModel({...data});
    await user.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Gets all users
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await UserModel.find({}, {password: 0}).exec();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a user by id
 * @param req Express request object containing the id of the user
 * @param res Express response object
 * @param next Express next function
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const {id} = matchedData(req) as { id: string };
  try {
    await UserModel.findByIdAndDelete(id).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
