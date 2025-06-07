import { IImageEntity } from "./image.entity";

/**
 * Repository layer for images
 * This layer is responsible for the data of the images
 * It uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export interface IImageRepository {
    findAll(): Promise<IImageEntity[]>;
    findById(id: number): Promise<IImageEntity | null>;
    create(image: Omit<IImageEntity, 'id'>): Promise<IImageEntity | null>;
    update(image: Omit<IImageEntity, 'id'>): Promise<IImageEntity | null>;
    delete(id: number): Promise<boolean>;
}