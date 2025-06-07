import { IAstronautEntity } from "./astronaut.entity";
import { IPlanetEntity } from "../../planet/domain/planet.entity";
import { IImageEntity } from "../../image/domain/image.entity";

/**
 * Repository layer for astronauts
 * This layer is responsible for the data of the astronauts
 * It uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export interface IAstronautRepository {
    findAll(): Promise<Array<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } }>>;
    findById(id: number): Promise<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } } | null>;
    create(astronaut: Omit<IAstronautEntity, 'id'>): Promise<IAstronautEntity | null>;
    update(astronaut: IAstronautEntity): Promise<IAstronautEntity | null>;
    delete(id: number): Promise<boolean>;
}