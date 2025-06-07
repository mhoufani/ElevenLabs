/**
 * Entity layer for planets
 * This layer is responsible for the data of the planets
 * It uses the repository layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export interface IPlanetEntity {
    id: number;
    name: string;
    description: string;
    isHabitable: boolean;
    imageId: number;
}