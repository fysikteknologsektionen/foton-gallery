import {
  addImages,
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbums,
  updateAlbum,
  updateImages,
} from '../controllers';
/* eslint-disable new-cap */
import {albumValidators, validate} from '../validation';

import {Router} from 'express';
import {config} from '../../config';
import {getAlbumCount} from '../controllers/albums';
import {restrictToUsers} from '../middlewares';
import {upload} from '../utils';

// Public endpoints
const publicRouter = Router();

publicRouter.get(
    '/:date/:slug',
    validate(albumValidators, ['date', 'slug']),
    getAlbum,
);

publicRouter.get('/', validate(albumValidators, ['page', 'count']), getAlbums);

publicRouter.get('/count', getAlbumCount);

// Private endpoints
const privateRouter = Router();
privateRouter.use(restrictToUsers);

privateRouter.post(
    '/',
    validate(albumValidators, [
      'name',
      'date',
      'authors',
      'authors.*',
      'description',
    ]),
    createAlbum,
);

privateRouter.put(
    '/:id',
    validate(albumValidators, [
      'id',
      'name',
      'date',
      'authors',
      'authors.*',
      'description',
    ]),
    updateAlbum,
);

privateRouter.delete('/:id', validate(albumValidators, ['id']), deleteAlbum);

privateRouter.post(
    '/:id/images',
    validate(albumValidators, ['id']),
    upload.array('images', config.APP_MAX_FILE_UPLOADS),
    addImages,
);

privateRouter.put(
    '/:id/images',
    validate(albumValidators, ['id', 'images', 'thumbnail']),
    updateImages,
);

publicRouter.use('/', privateRouter);
export {publicRouter as albumsRouter};
