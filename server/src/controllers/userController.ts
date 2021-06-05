import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models';
import { User } from '../types';

export async function createUser (req: Request, res: Response, next: NextFunction) {
  try {
    const User: User = new UserModel({ ...req.body });
    await User.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function deleteUser (req: Request, res: Response, next: NextFunction) {
  try {
    await UserModel.findByIdAndDelete(req.query.id).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}