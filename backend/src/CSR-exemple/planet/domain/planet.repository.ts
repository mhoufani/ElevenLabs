import { IImageEntity } from "../../image/domain/image.entity";
import { IPlanetEntity } from "./planet.entity.js";

/**
 * Repository layer for planets
 * This layer is responsible for the data of the planets
 * It uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export interface IPlanetRepository { 
    findAll(params?: { filterName?: string }): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity }[]>;
    findById(id: number): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } | null>;
    create(planet: Omit<IPlanetEntity, 'id'>): Promise<IPlanetEntity>;
    update(planet: IPlanetEntity): Promise<IPlanetEntity | null>;
    delete(id: number): Promise<boolean>;
}