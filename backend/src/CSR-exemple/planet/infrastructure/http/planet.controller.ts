import { PlanetService } from "../../application/planet.service";

import { Request, Response } from "express";
import Logger from "../../../../utils/logger";

/**
 * Controller layer for planets
 * This layer is responsible for the HTTP requests of the planets
 * It uses the service layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class PlanetController {
    constructor(private readonly planetService: PlanetService) {}

    async getPlanets(req: Request, res: Response): Promise<void> {
        try {
            const planets = await this.planetService.getPlanets();
            Logger.info('PlanetController.getPlanets', `Successfully fetched ${planets.length} planets`);
            res.status(200).json(planets);
        } catch (error) {
            Logger.error('PlanetController.getPlanets', 'Failed to fetch planets', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getPlanetById(req: Request, res: Response): Promise<void> {
        try {
            const planet = await this.planetService.getPlanetById(parseInt(req.params.id));
            if (!planet) {
                Logger.warn('PlanetController.getPlanetById', `Planet not found: ${req.params.id}`);
                res.status(404).json({ error: 'Planet not found' });
                return;
            }
            Logger.info('PlanetController.getPlanetById', `Successfully fetched planet ${planet.id}`);
            res.status(200).json(planet);
        } catch (error) {
            Logger.error('PlanetController.getPlanetById', 'Failed to fetch planet', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createPlanet(req: Request, res: Response): Promise<void> {
        try {
            const planet = await this.planetService.createPlanet(req.body);
            if (!planet) {
                Logger.warn('PlanetController.createPlanet', `Failed to create planet`);
                res.status(400).json({ error: 'Failed to create planet' });
                return;
            }
            Logger.info('PlanetController.createPlanet', `Successfully created planet ${planet.id}`);
            res.status(201).json(planet);
        } catch (error) {
            Logger.error('PlanetController.createPlanet', 'Failed to create planet', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updatePlanet(req: Request, res: Response): Promise<void> {
        try {
            const planet = await this.planetService.updatePlanet(req.body);
            if (!planet) {
                Logger.warn('PlanetController.updatePlanet', `Failed to update planet`);
                res.status(400).json({ error: 'Failed to update planet' });
                return;
            }
            Logger.info('PlanetController.updatePlanet', `Successfully updated planet ${planet.id}`);
            res.status(200).json(planet);
        } catch (error) {
            Logger.error('PlanetController.updatePlanet', 'Failed to update planet', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deletePlanet(req: Request, res: Response): Promise<void> {
        try {
            const isDeleted = await this.planetService.deletePlanet(parseInt(req.params.id));
            Logger.info('PlanetController.deletePlanet', `Successfully deleted planet ${isDeleted}`);
            res.status(200).json({ message: 'Planet deleted successfully' });
        } catch (error) {
            Logger.error('PlanetController.deletePlanet', 'Failed to delete planet', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}