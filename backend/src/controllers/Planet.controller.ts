import { Request, Response } from 'express';
import knex from '../db';
import Logger from '../utils/logger';
import { PlanetEntity, CreatePlanetDto, UpdatePlanetDto } from '../entities/Planet.entity';

/**
 * Interface for the image object in planet responses
 */
interface PlanetImage {
  path: string;
  name: string;
}

/**
 * Interface for planet request body
 */
interface PlanetRequestBody {
  name: string;
  description: string;
  isHabitable: boolean;
  imageId: number;
}

/**
 * Interface for planet response object
 */
interface PlanetResponse {
  id: number;
  name: string;
  description: string;
  isHabitable: boolean;
  image: PlanetImage;
}

/**
 * Controller handling all planet-related operations
 * @namespace PlanetController
 */
const PlanetController = {
  /**
   * Retrieves all planets with their associated image information
   * @async
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with array of planets
   * @throws {Error} When database query fails
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const planetsData = await knex('planets')
        .select(
          'planets.*',
          'images.path',
          'images.name as imageName'
        )
        .join('images', 'images.id', '=', 'planets.imageId');

      const planets = planetsData.map(data => {
        const planet = PlanetEntity.fromDatabase(data);
        return planet.toResponse({
          path: data.path,
          name: data.imageName,
        });
      });

      res.status(200).json(planets);
    } catch (error) {
      Logger.error('PlanetController.getAll', 'Failed to fetch planets', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Retrieves a single planet by ID with its associated image information
   * @async
   * @param {Request} req - Express request object containing planet ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with planet data or 404 if not found
   * @throws {Error} When database query fails
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const planetData = await knex('planets')
        .select(
          'planets.*',
          'images.path',
          'images.name as imageName'
        )
        .join('images', 'images.id', '=', 'planets.imageId')
        .where('planets.id', id)
        .first();

      if (planetData) {
        const planet = PlanetEntity.fromDatabase(planetData);
        const response = planet.toResponse({
          path: planetData.path,
          name: planetData.imageName,
        });
        res.status(200).json(response);
      } else {
        Logger.warn('PlanetController.getById', `Planet not found with id: ${id}`);
        res.status(404).json({ error: 'Planet not found' });
      }
    } catch (error) {
      Logger.error('PlanetController.getById', `Failed to fetch planet with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Creates a new planet
   * @async
   * @param {Request} req - Express request object containing planet data in body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with created planet data
   * @throws {Error} When database insertion fails
   */
  create: async (req: Request, res: Response): Promise<void> => {
    const planetData: CreatePlanetDto = req.body;
    try {
      const [id] = await knex('planets').insert(planetData);
      
      const createdPlanet = await knex('planets')
        .select(
          'planets.*',
          'images.path',
          'images.name as imageName'
        )
        .join('images', 'images.id', '=', 'planets.imageId')
        .where('planets.id', id)
        .first();

      const planet = PlanetEntity.fromDatabase(createdPlanet);
      const response = planet.toResponse({
        path: createdPlanet.path,
        name: createdPlanet.imageName,
      });

      Logger.info('PlanetController.create', `Successfully created planet with id: ${id}`);
      res.status(201).json(response);
    } catch (error) {
      Logger.error('PlanetController.create', 'Failed to create planet', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Updates an existing planet by ID
   * @async
   * @param {Request} req - Express request object containing planet ID in params and update data in body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with updated planet data or 404 if not found
   * @throws {Error} When database update fails
   */
  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdatePlanetDto = req.body;
    try {
      const updatedRows = await knex('planets').where('id', id).update(updateData);
      if (updatedRows > 0) {
        const updatedPlanet = await knex('planets')
          .select(
            'planets.*',
            'images.path',
            'images.name as imageName'
          )
          .join('images', 'images.id', '=', 'planets.imageId')
          .where('planets.id', id)
          .first();

        const planet = PlanetEntity.fromDatabase(updatedPlanet);
        const response = planet.toResponse({
          path: updatedPlanet.path,
          name: updatedPlanet.imageName,
        });

        Logger.info('PlanetController.update', `Successfully updated planet with id: ${id}`);
        res.status(200).json(response);
      } else {
        Logger.warn('PlanetController.update', `Planet not found with id: ${id}`);
        res.status(404).json({ error: 'Planet not found' });
      }
    } catch (error) {
      Logger.error('PlanetController.update', `Failed to update planet with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Deletes a planet by ID
   * @async
   * @param {Request} req - Express request object containing planet ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends 204 status on success or 404 if not found
   * @throws {Error} When database deletion fails
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deletedRows = await knex('planets').where('id', id).del();
      if (deletedRows > 0) {
        Logger.info('PlanetController.delete', `Successfully deleted planet with id: ${id}`);
        res.status(204).json();
      } else {
        Logger.warn('PlanetController.delete', `Planet not found with id: ${id}`);
        res.status(404).json({ error: 'Planet not found' });
      }
    } catch (error) {
      Logger.error('PlanetController.delete', `Failed to delete planet with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default PlanetController;
