import { Request, Response } from 'express';
import knex from '../db';
import Logger from '../utils/logger';
import { ImageEntity, CreateImageDto, UpdateImageDto } from '../entities/Image.entity';

/**
 * Interface for image request body
 */
interface ImageRequestBody {
  name: string;
  path: string;
}

/**
 * Interface for image response object
 */
interface ImageResponse {
  id: number;
  name: string;
  path: string;
}

/**
 * Controller handling all image-related operations
 * @namespace ImageController
 */
const ImageController = {
  /**
   * Retrieves all images
   * @async
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with array of images
   * @throws {Error} When database query fails
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const imagesData = await knex('images').select('*');
      const images = imagesData.map(data => ImageEntity.fromDatabase(data).toResponse());
      
      Logger.info('ImageController.getAll', `Successfully fetched ${images.length} images`);
      res.status(200).json(images);
    } catch (error) {
      Logger.error('ImageController.getAll', 'Failed to fetch images', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Retrieves a single image by ID
   * @async
   * @param {Request} req - Express request object containing image ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with image data or 404 if not found
   * @throws {Error} When database query fails
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const imageData = await knex('images').where('id', id).first();
      if (imageData) {
        const image = ImageEntity.fromDatabase(imageData).toResponse();
        
        Logger.info('ImageController.getById', `Successfully fetched image with id: ${id}`);
        res.status(200).json(image);
      } else {
        Logger.warn('ImageController.getById', `Image not found with id: ${id}`);
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      Logger.error('ImageController.getById', `Failed to fetch image with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Creates a new image
   * @async
   * @param {Request} req - Express request object containing image data in body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with created image data
   * @throws {Error} When database insertion fails
   */
  create: async (req: Request, res: Response): Promise<void> => {
    const imageData: CreateImageDto = req.body;
    try {
      const [id] = await knex('images').insert(imageData);
      const image = ImageEntity.fromDatabase({ id, ...imageData }).toResponse();
      Logger.info('ImageController.create', `Successfully created image with id: ${id}`);
      res.status(201).json(image);
    } catch (error) {
      Logger.error('ImageController.create', 'Failed to create image', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Updates an existing image by ID
   * @async
   * @param {Request} req - Express request object containing image ID in params and update data in body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with success message or 404 if not found
   * @throws {Error} When database update fails
   */
  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateImageDto = req.body;
    try {
      const updatedRows = await knex('images').where('id', id).update(updateData);
      if (updatedRows > 0) {
        const updatedImage = await knex('images').where('id', id).first();
        const image = ImageEntity.fromDatabase(updatedImage).toResponse();
        Logger.info('ImageController.update', `Successfully updated image with id: ${id}`);
        res.status(200).json(image);
      } else {
        Logger.warn('ImageController.update', `Image not found with id: ${id}`);
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      Logger.error('ImageController.update', `Failed to update image with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Deletes an image by ID
   * @async
   * @param {Request} req - Express request object containing image ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends 204 status on success or 404 if not found
   * @throws {Error} When database deletion fails
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deletedRows = await knex('images').where('id', id).del();
      if (deletedRows > 0) {
        Logger.info('ImageController.delete', `Successfully deleted image with id: ${id}`);
        res.status(204).json();
      } else {
        Logger.warn('ImageController.delete', `Image not found with id: ${id}`);
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (error) {
      Logger.error('ImageController.delete', `Failed to delete image with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default ImageController;
