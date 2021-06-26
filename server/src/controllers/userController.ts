import {NextFunction, Request, Response} from 'express';
import {matchedData} from 'express-validator';
import {UserModel} from '../models';
import {User} from '../types';

/**
 * Creates a new user from email/password
 * @param {Request} req - Express request object containing email, password and admin status
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function createUser(req: Request, res: Response, next: NextFunction) {
  const data = matchedData(req) as Partial<User>;
  try {
    const user: User = new UserModel({...data});
    await user.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Gets all users
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users: Array<User> = await UserModel.find().exec();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a user by id
 * @param {Request} req - Express request object containing the id of the user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
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
