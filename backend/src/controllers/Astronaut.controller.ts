import { Request, Response } from 'express';
import knex from '../db';
import Logger from '../utils/logger';
import { AstronautEntity, CreateAstronautDto, UpdateAstronautDto } from '../entities/Astronaut.entity';

/**
 * Interface for the image object in the response
 */
interface ImageResponse {
  path: string;
  name: string;
}

/**
 * Interface for the planet object in the response
 */
interface PlanetResponse {
  id: number;
  name: string;
  description: string;
  isHabitable: boolean;
  image: ImageResponse;
}

/**
 * Interface for the astronaut object in the response
 */
interface AstronautResponse {
  id: number;
  firstname: string;
  lastname: string;
  originPlanet: PlanetResponse;
}

/**
 * Controller handling all astronaut-related operations
 * @namespace AstronautController
 */
const AstronautController = {
  /**
   * Retrieves all astronauts with their associated planet and image information
   * @async
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with array of astronauts
   * @throws {Error} When database query fails
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const astronautsData = await knex('astronauts')
        .select(
          'astronauts.id',
          'astronauts.firstname',
          'astronauts.lastname',
          'astronauts.originPlanetId',
          'planets.id as planetId',
          'planets.name as planetName',
          'planets.description as planetDescription',
          'planets.isHabitable',
          'images.path as imagePath',
          'images.name as imageName'
        )
        .join('planets', 'astronauts.originPlanetId', '=', 'planets.id')
        .join('images', 'planets.imageId', '=', 'images.id');

      const astronauts = astronautsData.map(data => {
        const astronaut = AstronautEntity.fromDatabase(data);
        return astronaut.toResponse({
          id: data.planetId,
          name: data.planetName,
          description: data.planetDescription,
          isHabitable: data.isHabitable,
          image: {
            path: data.imagePath,
            name: data.imageName,
          },
        });
      });

      res.status(200).json(astronauts);
    } catch (error) {
      Logger.error('AstronautController.getAll', 'Failed to fetch astronauts', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Retrieves a single astronaut by ID with their associated planet and image information
   * @async
   * @param {Request} req - Express request object containing astronaut ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with astronaut data or 404 if not found
   * @throws {Error} When database query fails
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const astronautData = await knex('astronauts')
        .select(
          'astronauts.id',
          'astronauts.firstname',
          'astronauts.lastname',
          'astronauts.originPlanetId',
          'planets.id as planetId',
          'planets.name as planetName',
          'planets.description as planetDescription',
          'planets.isHabitable',
          'images.path as imagePath',
          'images.name as imageName'
        )
        .join('planets', 'astronauts.originPlanetId', '=', 'planets.id')
        .join('images', 'planets.imageId', '=', 'images.id')
        .where('astronauts.id', id)
        .first();

      if (astronautData) {
        const astronaut = AstronautEntity.fromDatabase(astronautData);
        const response = astronaut.toResponse({
          id: astronautData.planetId,
          name: astronautData.planetName,
          description: astronautData.planetDescription,
          isHabitable: astronautData.isHabitable,
          image: {
            path: astronautData.imagePath,
            name: astronautData.imageName,
          },
        });
        res.status(200).json(response);
      } else {
        Logger.warn('AstronautController.getById', `Astronaut not found with id: ${id}`);
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      Logger.error('AstronautController.getById', `Failed to fetch astronaut with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Creates a new astronaut
   * @async
   * @param {Request} req - Express request object containing astronaut data in body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with created astronaut data
   * @throws {Error} When database insertion fails
   */
  create: async (req: Request, res: Response): Promise<void> => {
    const astronautData: CreateAstronautDto = req.body;
    try {
      const [id] = await knex('astronauts').insert(astronautData);

      const createdAstronaut = await knex('astronauts')
        .select(
          'astronauts.id',
          'astronauts.firstname',
          'astronauts.lastname',
          'astronauts.originPlanetId',
          'planets.id as planetId',
          'planets.name as planetName',
          'planets.description as planetDescription',
          'planets.isHabitable',
          'images.path as imagePath',
          'images.name as imageName'
        )
        .join('planets', 'astronauts.originPlanetId', '=', 'planets.id')
        .join('images', 'planets.imageId', '=', 'images.id')
        .where('astronauts.id', id)
        .first();

      const astronaut = AstronautEntity.fromDatabase(createdAstronaut);
      const response = astronaut.toResponse({
        id: createdAstronaut.planetId,
        name: createdAstronaut.planetName,
        description: createdAstronaut.planetDescription,
        isHabitable: createdAstronaut.isHabitable,
        image: {
          path: createdAstronaut.imagePath,
          name: createdAstronaut.imageName,
        },
      });

      Logger.info('AstronautController.create', `Successfully created astronaut with id: ${id}`);
      res.status(201).json(response);
    } catch (error) {
      Logger.error('AstronautController.create', 'Failed to create astronaut', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Updates an existing astronaut by ID
   * @async
   * @param {Request} req - Express request object containing astronaut ID in params and update data in body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with updated astronaut data or 404 if not found
   * @throws {Error} When database update fails
   */
  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateAstronautDto = req.body;
    try {
      const updatedRows = await knex('astronauts').where('id', id).update(updateData);
      if (updatedRows > 0) {
        const updatedAstronaut = await knex('astronauts')
          .select(
            'astronauts.id',
            'astronauts.firstname',
            'astronauts.lastname',
            'astronauts.originPlanetId',
            'planets.id as planetId',
            'planets.name as planetName',
            'planets.description as planetDescription',
            'planets.isHabitable',
            'images.path as imagePath',
            'images.name as imageName'
          )
          .join('planets', 'astronauts.originPlanetId', '=', 'planets.id')
          .join('images', 'planets.imageId', '=', 'images.id')
          .where('astronauts.id', id)
          .first();

        const astronaut = AstronautEntity.fromDatabase(updatedAstronaut);
        const response = astronaut.toResponse({
          id: updatedAstronaut.planetId,
          name: updatedAstronaut.planetName,
          description: updatedAstronaut.planetDescription,
          isHabitable: updatedAstronaut.isHabitable,
          image: {
            path: updatedAstronaut.imagePath,
            name: updatedAstronaut.imageName,
          },
        });

        Logger.info('AstronautController.update', `Successfully updated astronaut with id: ${id}`);
        res.status(200).json(response);
      } else {
        Logger.warn('AstronautController.update', `Astronaut not found with id: ${id}`);
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      Logger.error('AstronautController.update', `Failed to update astronaut with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Deletes an astronaut by ID
   * @async
   * @param {Request} req - Express request object containing astronaut ID in params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} Sends 204 status on success or 404 if not found
   * @throws {Error} When database deletion fails
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deletedRows = await knex('astronauts').where('id', id).del();
      if (deletedRows > 0) {
        Logger.info('AstronautController.delete', `Successfully deleted astronaut with id: ${id}`);
        res.status(204).json();
      } else {
        Logger.warn('AstronautController.delete', `Astronaut not found with id: ${id}`);
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      Logger.error('AstronautController.delete', `Failed to delete astronaut with id: ${id}`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default AstronautController;
