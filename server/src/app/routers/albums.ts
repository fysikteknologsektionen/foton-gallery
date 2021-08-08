import {
  addImageToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbumCount,
  getAlbums,
  updateAlbumImages,
  updateAlbumMeta,
} from '../controllers';
import {albumValidators, validate} from '../validation';

import {Router} from 'express';
import {restrictToAuthenticated} from '../middlewares/authentication';
import {upload} from '../utils';

// Public endpoints
// eslint-disable-next-line new-cap
const publicRouter = Router();

publicRouter.get(
    '/:date/:slug',
    validate(albumValidators, ['date', 'slug']),
    getAlbum,
);

publicRouter.get('/', validate(albumValidators, ['page', 'count']), getAlbums);

publicRouter.get('/count', getAlbumCount);

// Private endpoints
// eslint-disable-next-line new-cap
const privateRouter = Router();
privateRouter.use(restrictToAuthenticated);

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

privateRouter.patch(
    '/:id',
    validate(albumValidators, [
      'id',
      'name',
      'date',
      'authors',
      'authors.*',
      'description',
    ]),
    updateAlbumMeta,
);

privateRouter.delete('/:id', validate(albumValidators, ['id']), deleteAlbum);

privateRouter.post(
    '/:id/images',
    validate(albumValidators, ['id']),
    upload.single('image'),
    addImageToAlbum,
);

privateRouter.patch(
    '/:id/images',
    validate(albumValidators, ['id', 'images', 'thumbnail']),
    updateAlbumImages,
);

publicRouter.use('/', privateRouter);
export {publicRouter as albumsRouter};
