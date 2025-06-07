import { IAstronautRepository } from "../domain/astronaut.repository.js";

import { IAstronautEntity } from "../domain/astronaut.entity.js";
import { IPlanetEntity } from "../../planet/domain/planet.entity";
import { IImageEntity } from "../../image/domain/image.entity";
/**
 * Service layer for astronauts
 * This layer is responsible for the business logic of the astronauts
 * It uses the repository layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class AstronautService {
    constructor(private readonly astronautRepository: IAstronautRepository) {}

    async getAstronauts(): Promise<Array<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } }>> {
        return this.astronautRepository.findAll();
    }

    async getAstronautById(id: number): Promise<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } } | null> {
        const astronaut = await this.astronautRepository.findById(id);
        return astronaut;
    }

    async createAstronaut(astronaut: Omit<IAstronautEntity, 'id'>): Promise<IAstronautEntity | null> {
        const createdAstronaut = await this.astronautRepository.create(astronaut);
        return createdAstronaut ?? null;
    }
    
    async updateAstronaut(astronaut: IAstronautEntity): Promise<IAstronautEntity | null> {
        const updatedAstronaut = await this.astronautRepository.update(astronaut);
        return updatedAstronaut;
    }

    async deleteAstronaut(id: number): Promise<boolean> {
        return this.astronautRepository.delete(id);
    }
}