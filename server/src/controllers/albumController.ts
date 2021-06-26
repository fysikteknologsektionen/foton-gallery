import {NextFunction, Request, Response} from 'express';
import {matchedData} from 'express-validator';
import {AlbumModel} from '../models';
import {Album} from '../types';
import {processImages} from '../utils/processImages';

/**
 * Creates a new album
 * @param {Request} req - Express request object containing album key-value data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function createAlbum(req: Request, res: Response, next: NextFunction) {
  const data = matchedData(req) as Partial<Album>;

  // Since we use Multer.array() we can guarantee req.files is an array
  const files = req.files as Express.Multer.File[];
  const fileNames = files.map((file: Express.Multer.File) => file.filename);
  data.images = fileNames;

  try {
    const album = new AlbumModel({...data});
    await album.save();
    processImages(files);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a subset of albums based on some offset and limit
 * @param {Request} req - Express request object containing offset (skip) and limit
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function getAlbums(req: Request, res: Response, next: NextFunction) {
  const {offset, limit} = matchedData(req) as {limit: number, offset: number};
  try {
    const albums = await AlbumModel.find().sort('-dates').skip(offset).limit(limit).exec();
    res.json(albums);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a specific album
 * @param {Request} req - Express request object containing date and album slug
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function getAlbum(req: Request, res: Response, next: NextFunction) {
  const {date, slug} = matchedData(req) as {date: Date, slug: string};
  try {
    const album = await AlbumModel.findOne({date: date, slug: slug}).exec();
    if (!album) {
      throw new Error('Album does not exist.');
    }
    res.json(album);
  } catch (error) {
    next(error);
  }
}

/**
 * (Partially) updates an album
 * @param {Reqest} req - Expres request object containing ID of the album and key-values to update
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function updateAlbum(req: Request, res: Response, next: NextFunction) {
  const {id, ...data} = matchedData(req) as { id: string, data: Partial<Album> };
  try {
    await AlbumModel.findByIdAndUpdate(id, {...data}).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an album
 * @param {Request} req - Express request object containing ID of the album
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function deleteAlbum(req: Request, res: Response, next: NextFunction) {
  const {id} = matchedData(req) as { id: string };
  try {
    await AlbumModel.findByIdAndDelete(id).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
