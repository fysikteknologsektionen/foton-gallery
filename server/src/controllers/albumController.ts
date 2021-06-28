import {NextFunction, Request, Response} from 'express';
import {matchedData} from 'express-validator';
import {AlbumModel} from '../models';
import {processImages} from '../utils/processImages';

/**
 * Creates a new album
 * @param {Request} req - Express request object containing album key-value data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function createAlbum(req: Request, res: Response, next: NextFunction) {
  const data = matchedData(req);
  try {
    const album = new AlbumModel({...data});
    const result = await album.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Adds images to an existing album
 * @param {Request} req - Express request object containing album id and images to add
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function addImages(req: Request, res: Response, next: NextFunction) {
  const {id} = matchedData(req) as {id: string};
  // Since we use Multer.array() we can guarantee req.files is an array
  const files = req.files as Express.Multer.File[];
  const fileNames = files.map((file) => file.filename);
  try {
    await AlbumModel.updateOne({_id: id}, {images: fileNames}).exec();
    await processImages(files);
    res.status(201).json(fileNames);
  } catch (error) {
    /* TODO: Remove image files if error is thrown */
    next(error);
  }
}

/**
 * Gets a subset of albums based on some search parameters
 * @param {Request} req - Express request object containing (optional) search parameters
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function getAlbums(req: Request, res: Response, next: NextFunction) {
  const {limit, offset, slug, date} = matchedData(req) as {
    limit?: number,
    offset?: number,
    slug?: string,
    date?: Date
  };
  try {
    const query = AlbumModel.find().sort('-dates');
    // Build the query dynamically from search parameters
    if (limit) {
      query.limit(limit);
    } else {
      // Default limit if not set
      query.limit(24);
    }
    if (offset) {
      query.skip(offset);
    }
    if (slug) {
      query.where('slug').equals(slug);
    }
    if (date) {
      query.where('date').equals(date);
    }
    const albums = await query.exec();
    res.json(albums);
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
  const {id, name, description, authors, date, images, thumbnail} = matchedData(req) as {
    id: string,
    name?: string,
    description?: string,
    authors?: string[],
    date?: Date,
    images?: string[],
    thumbnail?: string
  };
  try {
    const album = await AlbumModel.findById(id);
    if (!album) {
      throw new Error('Album does not exist.');
    }
    if (name) {
      album.name = name;
    }
    if (description) {
      album.description = description;
    }
    if (authors) {
      album.authors = authors;
    }
    if (date) {
      album.date = date;
    }
    if (images) {
      const newImages = images?.filter((x) => !album.images?.includes(x));
      if (newImages.length) {
        throw new Error('Cannot add new images.');
      }
      const removedImages = album.images?.filter((x) => !images.includes(x));
      console.log(removedImages);
      /* TODO: remove image files */
    }
    if (thumbnail) {
      const validImages = images ? images : album.images;
      if (!validImages?.includes(thumbnail)) {
        throw new Error('Album must contain image selected as thumbnail.');
      }
      album.thumbnail = thumbnail;
    }
    const result = await album.save();
    res.json(result);
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
  const {id} = matchedData(req) as {id: string};
  try {
    await AlbumModel.findByIdAndDelete(id).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
