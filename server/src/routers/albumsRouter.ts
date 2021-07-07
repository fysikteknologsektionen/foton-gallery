import {authenticateUser, checkValidationResult} from '../middleware';

/* eslint-disable new-cap */
import {AlbumModel} from '../models';
import {EntryNotFoundError} from '../errors';
import {Router} from 'express';
import {albumController} from '../controllers';
import {check} from 'express-validator';
import {config} from '../config';
import {upload} from '../utils';

// Public endpoints
const publicRouter = Router();

publicRouter.get(
    '/:date/:slug',
    check('date').isDate().toDate(),
    check('slug').notEmpty().escape().trim(),
    checkValidationResult,
    albumController.getAlbum,
);

publicRouter.get(
    '/',
    check('limit').isInt({min: 1, max: 24}).toInt(),
    check('offset').isInt({min: 0}).toInt(),
    checkValidationResult,
    albumController.getAlbums,
);

// Private endpoints
const privateRouter = Router();
privateRouter.use(authenticateUser);

const albumValidationChain = [
  check('name').notEmpty().escape().trim(),
  check('date').isDate().toDate(),
  check('authors').optional().isArray(),
  check('authors.*').notEmpty().escape().trim(),
  check('description').optional().escape().trim(),
];

privateRouter.post(
    '/',
    albumValidationChain,
    checkValidationResult,
    albumController.createAlbum,
);

privateRouter.put(
    '/:id',
    check('id').notEmpty().isAlphanumeric(),
    albumValidationChain,
    checkValidationResult,
    albumController.updateAlbum,
);

privateRouter.delete(
    '/:id',
    check('id').notEmpty().isAlphanumeric(),
    checkValidationResult,
    albumController.deleteAlbum,
);

privateRouter.post(
    '/:id/images',
    check('id').notEmpty().isAlphanumeric().bail().custom(async (id) => {
      return AlbumModel.exists({_id: id}).then((exists) => {
        if (!exists) {
          return Promise.reject(
              new EntryNotFoundError('Album cannot be found.'),
          );
        }
      });
    }),
    checkValidationResult,
    upload.array('images', config.APP_MAX_FILE_UPLOADS),
    albumController.addImages,
);

privateRouter.put(
    '/:id/images',
    check('id').notEmpty().isAlphanumeric(),
    check('images').optional().isArray(),
    check('images.*').notEmpty().escape().trim(),
    check('thumbnail').optional().notEmpty().escape().trim(),
    checkValidationResult,
    albumController.updateImages,
);

publicRouter.use('/', privateRouter);
export {publicRouter as albumsRouter};
