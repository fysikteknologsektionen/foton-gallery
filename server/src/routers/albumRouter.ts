import { Router } from 'express';
import { albumController, authController } from '../controllers';

export const albumRouter: Router = Router();

/**
 * Middleware
 */
albumRouter.use(authController.populateUserField);
albumRouter.use(authController.authenticateUser);

/**
 * Endpoints
 */
albumRouter.post('/', albumController.createAlbum);
albumRouter.get('/', albumController.getAlbums);
albumRouter.put('', albumController.updateAlbum);
albumRouter.delete('/', albumController.deleteAlbum);