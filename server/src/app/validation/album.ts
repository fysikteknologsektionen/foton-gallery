/* eslint-disable prefer-promise-reject-errors */

import {CustomValidator, body, check, param, query} from 'express-validator';

import {Album} from '../models';

/**
 * Checks to make sure no new images have been added to the array
 * (Since this should only be done automatically by the server)
 * @param images Array of images
 * @param req Request object
 */
const noNewImages: CustomValidator = async (
    images: string[],
    {req},
): Promise<void> => {
  const album = await Album.findById(req.params?.id);
  if (!album) {
    return Promise.reject();
  }
  const result = images.every((image) => album.images.includes(image));
  if (!result) {
    return Promise.reject();
  }
};

/**
 * Checks if the the thumbnail is a valid image
 * @param thumbnail Thumbnail index
 * @param req Request object
 * @returns True if the value passes validation
 */
const validThumbnail: CustomValidator = (thumbnail: string, {req}): boolean => {
  if (!(req.body.images as string[]).includes(thumbnail)) {
    throw new Error();
  }
  return true;
};

export const albumValidators = {
  id: param('id').notEmpty().isAlphanumeric(),
  name: body('name').notEmpty().escape().trim(),
  slug: param('slug').notEmpty().escape().trim(),
  date: check('date').isDate().toDate(),
  description: body('description').optional().notEmpty().escape().trim(),
  authors: body('authors').optional().isArray({min: 1}),
  ['authors.*']: body('authors.*').notEmpty().escape().trim(),
  images: body('images').optional().isArray().bail().custom(noNewImages),
  thumbnail: body('thumbnail').optional().custom(validThumbnail),
  count: query('count').isInt({min: 1, max: 32}).toInt(),
  page: query('page').isInt({min: 1}).toInt(),
};
