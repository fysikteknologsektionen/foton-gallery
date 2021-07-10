import {NextFunction, Request, Response} from 'express';
import {UserAuthenicationData, UserSession} from '../../interfaces';

import {NotFoundError} from '../errors';
import {User} from '../models';
import {matchedData} from 'express-validator';

/**
 * Creates a new user.
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function createUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const data = matchedData(req) as UserSession & UserAuthenicationData;
  try {
    const user = new User({...data});
    await user.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a user
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id, ...data} = matchedData(req) as {id: string} & UserSession &
    UserAuthenicationData;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    user.set(data);
    await user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Gets all users
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  try {
    const users = await User.find({}, {password: 0}).exec();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a user
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id} = matchedData(req) as {id: string};
  try {
    const user = await User.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
