import { Router } from 'express';
import { check } from 'express-validator';
import { albumController, authController } from '../controllers';
import { checkValidationResult } from '../utils';

export const albumRouter: Router = Router();

/**
 * Middleware
 */
albumRouter.use(authController.populateUserField);
albumRouter.use(authController.authenticateUser);

/**
 * Endpoints
 */
albumRouter.post(
  '/',
  check('name').notEmpty().isString().escape(),
  check('description').optional({ checkFalsy: true }).isString().escape(),
  check('authors').optional({ checkFalsy: true }).isArray(),
  check('authors.*').isString().escape(),
  check('date').notEmpty().isDate().toDate(),
  checkValidationResult,
  albumController.createAlbum
);

albumRouter.get(
  '/',
  check('limit').isInt({ min: 1, max: 24}),
  check('offset').isInt({ min: 0 }),
  checkValidationResult,
  albumController.getAlbums
);

albumRouter.put(
  '/',
  check('id').notEmpty().isString().escape(),
  check('name').optional({ checkFalsy: true }).isString().escape(),
  check('description').optional().isString().escape(),
  check('authors').optional().isArray(),
  check('authors.*').isString().escape(),
  check('date').optional({ checkFalsy: true }).isDate().toDate(),
  albumController.updateAlbum
);

albumRouter.delete(
  '/',
  check('id').notEmpty().escape(),
  albumController.deleteAlbum
);