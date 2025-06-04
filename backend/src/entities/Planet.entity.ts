import { Image } from './Image.entity';

/**
 * Base interface for Planet entity
 */
export interface IPlanet {
  name: string;
  description: string;
  isHabitable: boolean;
  imageId: number;
}

/**
 * Interface for Planet entity with ID
 */
export interface Planet extends IPlanet {
  id: number;
}

/**
 * Interface for Planet response with image details
 */
export interface PlanetResponse extends Omit<Planet, 'imageId'> {
  image: {
    path: string;
    name: string;
  };
}

/**
 * Type for creating a new Planet
 */
export type CreatePlanetDto = IPlanet;

/**
 * Type for updating a Planet
 */
export type UpdatePlanetDto = Partial<IPlanet>;

/**
 * Planet entity class
 */
export class PlanetEntity implements Planet {
  id: number;
  name: string;
  description: string;
  isHabitable: boolean;
  imageId: number;

  constructor(data: Planet) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.isHabitable = data.isHabitable;
    this.imageId = data.imageId;
  }

  /**
   * Creates a PlanetEntity instance from database data
   * @param {any} data - Raw data from database
   * @returns {PlanetEntity} New PlanetEntity instance
   */
  static fromDatabase(data: any): PlanetEntity {
    return new PlanetEntity({
      id: data.id,
      name: data.name,
      description: data.description,
      isHabitable: data.isHabitable,
      imageId: data.imageId,
    });
  }

  /**
   * Converts PlanetEntity to a response object with image details
   * @param {Image} image - Associated image data
   * @returns {PlanetResponse} Response object with image details
   */
  toResponse(image: { path: string; name: string }): PlanetResponse {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isHabitable: this.isHabitable,
      image: {
        path: image.path,
        name: image.name,
      },
    };
  }
} 