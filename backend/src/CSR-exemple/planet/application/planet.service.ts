import { IPlanetRepository } from "../domain/planet.repository";
import { IImageEntity } from "../../image/domain/image.entity";
import { IPlanetEntity } from "../domain/planet.entity";

/**
 * Service layer for planets
 * This layer is responsible for the business logic of the planets
 * It uses the repository layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class PlanetService {
    constructor(private readonly planetRepository: IPlanetRepository) {}

    async getPlanets(): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity }[]> {
        const planets = await this.planetRepository.findAll();
        return planets;
    }

    async getPlanetById(id: number): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } | null> {
        const planet = await this.planetRepository.findById(id);
        return planet ?? null;
    }
    
    async createPlanet(planet: Omit<IPlanetEntity, 'id'>): Promise<IPlanetEntity | null> {
        const createdPlanet = await this.planetRepository.create(planet);
        return createdPlanet ?? null;
    }

    async updatePlanet(planet: IPlanetEntity): Promise<IPlanetEntity | null> {
        const updatedPlanet = await this.planetRepository.update(planet);
        return updatedPlanet ?? null;
    }

    async deletePlanet(id: number): Promise<boolean> {
        const deleted = await this.planetRepository.delete(id);
        return deleted ?? false;
    }
}