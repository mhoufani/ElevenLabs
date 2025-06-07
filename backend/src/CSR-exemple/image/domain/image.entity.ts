/**
 * Entity layer for images
 * This layer is responsible for the data of the images
 * It uses the repository layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export interface IImageEntity {
    id: number;
    name: string;
    path: string;
}