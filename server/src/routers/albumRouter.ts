import {NextFunction, Request, Response, Router} from 'express';
import {check} from 'express-validator';
import {albumController, authController} from '../controllers';
import {getAlbum, getAlbums} from '../controllers/albumController';
import {config} from '../env';
import {checkValidationResult} from '../utils/checkValidationResult';
import {upload} from '../utils/upload';

// eslint-disable-next-line new-cap
export const albumRouter = Router();

/**
 * Tries to split the authors string into an array of strings (since FormData cannot encode arrays directly).
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
function splitAuthorsString(req: Request, res: Response, next: NextFunction) {
  if (req.body.authors) {
    req.body.authors = req.body.authors.split(',');
  }
  next();
}

/**
 * Endpoints
 */
albumRouter.post(
    '/',
    // authController.populateUserField,
    // authController.authenticateUser,
    upload.array('images', Number(config.APP_MAX_FILE_UPLOADS)),
    splitAuthorsString,
    check('name').notEmpty().escape().trim(),
    check('description').optional({checkFalsy: true}).escape().trim(),
    check('authors').optional({checkFalsy: true}).isArray(),
    check('authors.*').escape().trim(),
    check('date').isDate().toDate(),
    checkValidationResult,
    albumController.createAlbum,
);

/**
 * Selects which endpoint to use based on query parameters
 * @param {Request} req - Express request object
 * @param {Response} res - Express reponse object
 * @param {NextFunction} next - Express next function
 */
function selectGetAlbumEndpoint(req: Request, res: Response, next: NextFunction) {
  if (typeof req.query.limit != 'undefined' && typeof req.query.offset != 'undefined') {
    getAlbums(req, res, next);
  } else if (typeof req.query.date != 'undefined' && typeof req.query.slug != 'undefined') {
    getAlbum(req, res, next);
  } else {
    next(new Error('Missing query parameter(s).'));
  }
}

albumRouter.get(
    '/',
    check('limit').optional().isInt({min: 1, max: 24}).toInt(),
    check('offset').optional().isInt({min: 0}).toInt(),
    check('date').optional().isDate().toDate(),
    check('slug').optional().notEmpty().escape().trim(),
    checkValidationResult,
    selectGetAlbumEndpoint,
);

albumRouter.put(
    '/',
    authController.populateUserField,
    authController.authenticateUser,
    check('id').notEmpty().isAlphanumeric(),
    check('name').optional({checkFalsy: true}).escape(),
    check('description').optional().escape(),
    check('authors').optional().isArray(),
    check('authors.*').escape(),
    check('date').optional({checkFalsy: true}).isDate().toDate(),
    albumController.updateAlbum,
);

albumRouter.delete(
    '/',
    authController.populateUserField,
    authController.authenticateUser,
    check('id').notEmpty().isAlphanumeric(),
    albumController.deleteAlbum,
);
