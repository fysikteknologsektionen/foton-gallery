import { NextFunction, Request, Response } from 'express';
import AlbumModel from '../models/albumModel';
import { Album } from '../types';

export async function createAlbum (req: Request, res: Response, next: NextFunction) {
  try {
    const album: Album = new AlbumModel({ ...req.body });
    await album.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function getAlbums (req: Request, res: Response, next: NextFunction) {
  try {
    const limit: number = Number(req.query.limit) || 12;
    const offset: number = Number(req.query.offset) || 0;
    const albums: Array<Album> = await AlbumModel.find().sort('-dates').skip(offset).limit(limit).exec();
    res.json(albums);
  } catch (error) {
    next(error);
  }
}

export async function updateAlbum (req: Request, res: Response, next: NextFunction) {
  try {
    await AlbumModel.findByIdAndUpdate(req.query.id, { ...req.body }).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function deleteAlbum (req: Request, res: Response, next: NextFunction) {
  try {
    await AlbumModel.findByIdAndDelete(req.query.id).exec();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}