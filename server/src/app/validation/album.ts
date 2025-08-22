/* eslint-disable prefer-promise-reject-errors */

import {CustomValidator, body, check, param, query} from 'express-validator';

import {Album} from '../models';
import mongoose from 'mongoose';

/**
 * Checks to make sure no new images have been added to the array
 * (Since this should only be done automatically by the server)
 * @param imageIds Array of image objects
 * @param req Request object
 * @returns Rejected promise if validation fails
 */
const noNewImages: CustomValidator = async (
    imageIds: mongoose.Types.ObjectId[],
    {req},
): Promise<void> => {
  const album = await Album.findById(req.params?.['id']).exec();
  if (!album) {
    return Promise.reject();
  }
  const result = imageIds.every((id) => album.images.includes(id));
  if (!result) {
    return Promise.reject();
  }
};

/**
 * Checks if the the thumbnail is a valid image of the album
 * @param thumbnail Thumbnail object
 * @param req Request object
 * @returns True if the value passes validation
 */
const validThumbnail: CustomValidator = (
    thumbnail: mongoose.Types.ObjectId,
    {req},
): boolean => {
  if (!req.body.images.includes(thumbnail)) {
    throw new Error();
  }
  return true;
};

export const albumValidators = {
  id: param('id').notEmpty().isAlphanumeric(),
  name: body('name').notEmpty().isString().trim(),
  slug: param('slug').notEmpty().isString().trim(),
  date: check('date').notEmpty().isDate().toDate(),
  description: body('description').optional().isString().trim(),
  authors: body('authors').optional().isArray(),
  ['authors.*']: body('authors.*').notEmpty().isString().trim(),
  tags: body('tags').optional().isArray(),
  ['tags.*']: body('tags.*').notEmpty().isString().trim(),
  images: body('images').optional().isArray().bail().custom(noNewImages),
  ['images.*']: body('images.*').notEmpty().isString().trim(),
  thumbnail: body('thumbnail')
      .optional()
      .isString()
      .trim()
      .custom(validThumbnail),
  count: query('count').notEmpty().isInt({min: 1, max: 32}).toInt(),
  page: query('page').notEmpty().isInt({min: 1}).toInt(),
  q: query('q').optional().isString().trim(),
  order: query('order').optional().isString().trim().isIn(['+date', '-date']),
};
