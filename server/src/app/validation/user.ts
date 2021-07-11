/* eslint-disable prefer-promise-reject-errors */

import {body, param} from 'express-validator';

export const userValidators = {
  id: param('id').notEmpty().isAlphanumeric().bail(),
  username: body('username').notEmpty().escape().trim(),
  password: body('password').notEmpty().escape().trim(),
  optionalPassword: body('password').optional().notEmpty().escape().trim(),
  role: body('role').isIn(['user', 'admin']),
};
