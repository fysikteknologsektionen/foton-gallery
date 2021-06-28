/* eslint-disable new-cap */
import {Router} from 'express';
import {check} from 'express-validator';
import {albumController, authController} from '../controllers';
import {config} from '../env';
import {AlbumModel} from '../models';
import {checkValidationResult} from '../utils/checkValidationResult';
import {upload} from '../utils/upload';

// Public endpoints
export const publicAlbumRouter = Router();

publicAlbumRouter.get(
    '/',
    check('limit').optional().isInt({min: 1, max: 24}).toInt(),
    check('offset').optional().isInt({min: 0}).toInt(),
    check('date').optional().isDate().toDate(),
    check('slug').optional().notEmpty().escape().trim(),
    checkValidationResult,
    albumController.getAlbums,
);

// Private endpoints
export const privateAlbumRouter = Router();
privateAlbumRouter.use(authController.authenticateUser);

privateAlbumRouter.post(
    '/',
    check('name').notEmpty().escape().trim(),
    check('description').optional().escape().trim(),
    check('authors').optional().isArray(),
    check('authors.*').escape().trim(),
    check('date').isDate().toDate(),
    checkValidationResult,
    albumController.createAlbum,
);

privateAlbumRouter.put(
    '/:id',
    check('id').notEmpty().isAlphanumeric(),
    check('name').optional({checkFalsy: true}).escape().trim(),
    check('description').optional().escape().trim(),
    check('authors').optional().isArray(),
    check('authors.*').escape().trim(),
    check('date').optional({checkFalsy: true}).isDate().toDate(),
    check('images').optional().isArray(),
    check('images.*').escape().trim(),
    check('thumbnail').optional().escape().trim(),
    checkValidationResult,
    albumController.updateAlbum,
);

privateAlbumRouter.post(
    '/:id/upload',
    check('id').notEmpty().isAlphanumeric().custom(async (value) => {
      return AlbumModel.exists({_id: value}).then((exists) => {
        if (!exists) {
          return Promise.reject(new Error('Album does not exist.'));
        }
      });
    }),
    checkValidationResult,
    upload.array('images', Number(config.APP_MAX_FILE_UPLOADS)),
    albumController.addImages,
);

privateAlbumRouter.delete(
    '/:id',
    check('id').notEmpty().isAlphanumeric(),
    checkValidationResult,
    albumController.deleteAlbum,
);
