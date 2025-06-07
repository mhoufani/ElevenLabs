import { Request, Response } from "express";
import { ImageService } from "../../application/image.service";
import Logger from "../../../../utils/logger";

/**
 * Controller layer for images
 * This layer is responsible for the HTTP requests of the images
 * It uses the service layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    async getImages(req: Request, res: Response): Promise<void> {
        try {
            const images = await this.imageService.getImages();
            Logger.info('ImageController.getImages', `Successfully fetched ${images.length} images`);
            res.status(200).json(images);
        } catch (error) {
            Logger.error('ImageController.getImages', 'Failed to fetch images', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getImageById(req: Request, res: Response): Promise<void> {
        try {
            const image = await this.imageService.getImageById(parseInt(req.params.id));
            if (!image) {
                Logger.warn('ImageController.getImageById', `Image not found: ${req.params.id}`);
                res.status(404).json({ error: 'Image not found' });
                return;
            }
            Logger.info('ImageController.getImageById', `Successfully fetched image ${image.id}`);
            res.status(200).json(image);
        } catch (error) {
            Logger.error('ImageController.getImageById', 'Failed to fetch image', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createImage(req: Request, res: Response): Promise<void> {
        try {
            const image = await this.imageService.createImage(req.body);
            if (!image) {
                Logger.warn('ImageController.createImage', `Failed to create image`);
                res.status(400).json({ error: 'Failed to create image' });
                return;
            }
            Logger.info('ImageController.createImage', `Successfully created image ${image.id}`);
            res.status(201).json(image);
        } catch (error) {
            Logger.error('ImageController.createImage', 'Failed to create image', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateImage(req: Request, res: Response): Promise<void> {
        try {
            const image = await this.imageService.updateImage(req.body);
            if (!image) {
                Logger.warn('ImageController.updateImage', `Failed to update image`);
                res.status(400).json({ error: 'Failed to update image' });
                return;
            }
            Logger.info('ImageController.updateImage', `Successfully updated image ${image.id}`);
            res.status(200).json(image);
        } catch (error) {
            Logger.error('ImageController.updateImage', 'Failed to update image', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteImage(req: Request, res: Response): Promise<void> {
        try {
            const success = await this.imageService.deleteImage(parseInt(req.params.id));
            if (success) {
                Logger.info('ImageController.deleteImage', `Successfully deleted image ${req.params.id}`);
                res.status(204).send();
            } else {
                Logger.warn('ImageController.deleteImage', `Image ${req.params.id} not found`);
                res.status(404).json({ error: 'Image not found' });
            }
        } catch (error) {
            Logger.error('ImageController.deleteImage', 'Failed to delete image', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}