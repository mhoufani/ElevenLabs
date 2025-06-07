import Logger from "../../../../utils/logger";
import { AstronautService } from "../../application/astronaut.service";
import { Request, Response } from "express";

/**
 * Controller layer for astronauts
 * This layer is responsible for the HTTP requests of the astronauts
 * It uses the service layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class AstronautController {
    constructor(private readonly astronautService: AstronautService) {}

    async getAstronauts(req: Request, res: Response) {
        try {
            const astronauts = await this.astronautService.getAstronauts();
            Logger.info("AstronautController.getAll",`Astronauts fetched successfully: ${astronauts.length}`);
            res.status(200).json(astronauts);
        } catch (error) {
            Logger.error("AstronautController.getAll",`Error fetching astronauts: ${error}`, error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAstronautById(req: Request, res: Response) {
        try {
            const astronaut = await this.astronautService.getAstronautById(parseInt(req.params.id));
            if (!astronaut) {
                Logger.warn("AstronautController.getById",`Astronaut not found: ${req.params.id}`);
                res.status(404).json({ error: "Astronaut not found" });
                return;
            }
            Logger.info("AstronautController.getById",`Astronaut fetched successfully: ${astronaut}`);
            res.status(200).json(astronaut);
        } catch (error) {
            Logger.error("AstronautController.getById",`Error fetching astronaut: ${error}`, error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


    async createAstronaut(req: Request, res: Response) {
        try {
            const astronaut = await this.astronautService.createAstronaut(req.body);
            if (!astronaut) {
                Logger.warn("AstronautController.create",`Failed to create astronaut`);
                res.status(400).json({ error: "Failed to create astronaut" });
                return;
            }
            Logger.info("AstronautController.create",`Astronaut created successfully: ${astronaut}`);
            res.status(201).json(astronaut);
        } catch (error) {
            Logger.error("AstronautController.create",`Error creating astronaut: ${error}`, error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async updateAstronaut(req: Request, res: Response) {
        try {
            const astronaut = await this.astronautService.updateAstronaut(req.body);
            if (!astronaut) {
                Logger.warn("AstronautController.update",`Failed to update astronaut`);
                res.status(400).json({ error: "Failed to update astronaut" });
                return;
            }
            Logger.info("AstronautController.update",`Astronaut updated successfully: ${astronaut}`);
            res.status(200).json(astronaut);
        } catch (error) {
            Logger.error("AstronautController.update",`Error updating astronaut: ${error}`, error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteAstronaut(req: Request, res: Response) {
        try {
            const isDeleted = await this.astronautService.deleteAstronaut(parseInt(req.params.id));
            if (isDeleted) {
                Logger.info("AstronautController.deleteAstronaut",`Astronaut deleted successfully: ${isDeleted}`);
                res.status(200).json({ message: "Astronaut deleted successfully" });
            } else {
                Logger.warn("AstronautController.deleteAstronaut",`Astronaut not found: ${req.params.id}`);
                res.status(404).json({ error: "Astronaut not found" });
            }
        } catch (error) {
            Logger.error("AstronautController.deleteAstronaut",`Error deleting astronaut: ${error}`, error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}