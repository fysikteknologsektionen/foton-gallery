import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models';
import { User } from '../types';

/**
 * Create a new user from email/password 
 * @param {Object} req.body - Object containing email/password 
 */
export async function createUser (req: Request, res: Response, next: NextFunction) {
  try {
    const user: User = new UserModel({ ...req.body });
    await user.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Gets all users
 */
export async function getUsers (req: Request, res: Response, next: NextFunction) {
  try {
    const users: Array<User> = await UserModel.find().exec();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a user by id
 * @param {string} req.query.id - Id of the user
 */
export async function deleteUser (req: Request, res: Response, next: NextFunction) {
  try {
    await UserModel.findByIdAndDelete(req.query.id).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}