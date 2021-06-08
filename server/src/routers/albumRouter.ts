import { Router } from 'express';
import { check } from 'express-validator';
import { albumController, authController } from '../controllers';
import { checkValidationResult } from '../utils';

export const albumRouter: Router = Router();
/**
 * Endpoints
 */
albumRouter.post(
  '/',
  authController.populateUserField,
  authController.authenticateUser,
  check('name').notEmpty().escape(),
  check('description').optional({ checkFalsy: true }).escape(),
  check('authors').optional({ checkFalsy: true }).isArray(),
  check('authors.*').escape(),
  check('date').isDate().toDate(),
  checkValidationResult,
  albumController.createAlbum
);

albumRouter.get(
  '/',
  check('limit').isInt({ min: 1, max: 24}).toInt(),
  check('offset').isInt({ min: 0 }).toInt(),
  checkValidationResult,
  albumController.getAlbums
);

albumRouter.put(
  '/',
  authController.populateUserField,
  authController.authenticateUser,
  check('id').notEmpty().isAlphanumeric(),
  check('name').optional({ checkFalsy: true }).escape(),
  check('description').optional().escape(),
  check('authors').optional().isArray(),
  check('authors.*').escape(),
  check('date').optional({ checkFalsy: true }).isDate().toDate(),
  albumController.updateAlbum
);

albumRouter.delete(
  '/',
  authController.populateUserField,
  authController.authenticateUser,
  check('id').notEmpty().isAlphanumeric(),
  albumController.deleteAlbum
);