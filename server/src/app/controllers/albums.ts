import {AlbumImageData, AlbumMetaData} from '../../interfaces';
import {ConflictError, NotFoundError} from '../errors';
import {NextFunction, Request, Response} from 'express';
import {deleteImages, processImage} from '../utils';

import {Album} from '../models';
import {matchedData} from 'express-validator';

/**
 * Creates a new album
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function createAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const data = matchedData(req) as AlbumMetaData;
  try {
    const album = new Album({...data});
    await album.save();
    res.status(201).json(album);
  } catch (error) {
    // Catch duplicate key error
    if (error.code === 11000) {
      next(
          new ConflictError(`Album with name ${data.name} and
            date ${data.date} already exists`),
      );
      return;
    }
    next(error);
  }
}

/**
 * Updates an album's meta information
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function updateAlbumMeta(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id, ...data} = matchedData(req, {includeOptionals: true}) as {
    id: string;
  } & AlbumMetaData;
  try {
    const album = await Album.findById(id);
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    album.set(data);
    await album.save();
    res.status(200).json(album);
  } catch (error) {
    // Catch duplicate key error
    if (error.code === 11000) {
      next(
          new ConflictError(`Album with name ${data.name} and
            date ${data.date} already exists`),
      );
      return;
    }
    next(error);
  }
}

/**
 * Gets a specific album from slug and date
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function getAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const data = matchedData(req) as {date: Date; slug: string};
  try {
    const album = await Album.findOne({...data}).exec();
    if (!album) {
      throw new NotFoundError(
          `Album with slug ${data.slug} and date ${data.date} not found`,
      );
    }
    res.json(album);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a subset of all albums sorted by date
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function getAlbums(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {count, page} = matchedData(req) as {count: number; page: number};
  try {
    const albums = await Album.find()
        .sort('-date')
        .limit(count)
        .skip((page - 1) * count)
        .exec();
    res.json(albums);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets approximate album count
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function getAlbumCount(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  try {
    const count = await Album.estimatedDocumentCount();
    res.json(count);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an album
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function deleteAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id} = matchedData(req) as {id: string};
  try {
    const album = await Album.findByIdAndDelete(id).exec();
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    if (album.images.length > 0) {
      await deleteImages(album.images);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Adds additional images to an album
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function addImageToAlbum(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id} = matchedData(req) as {id: string};
  // Since we use Multer.single() we can assert req.file will always
  // be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = req.file!;
  try {
    const album = await Album.findById(id).exec();
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    album.images.push(image.filename);
    await album.save();
    await processImage(image);
    res.status(201).json(image.filename);
  } catch (error) {
    // Delete images from disk
    try {
      await deleteImages([image.filename]);
    } catch (error) {
      console.error(error);
    }
    next(error);
  }
}

/**
 * Updates an album's images and thumbnail
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export async function updateAlbumImages(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
  const {id, ...data} = matchedData(req) as {
    id: string;
  } & AlbumImageData;
  try {
    const album = await Album.findById(id).exec();
    if (!album) {
      throw new NotFoundError(`Album with id ${id} not found`);
    }
    album.set(data);
    await album.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
