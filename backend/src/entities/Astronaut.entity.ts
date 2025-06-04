import { PlanetResponse } from './Planet.entity';

/**
 * Base interface for Astronaut entity
 */
export interface IAstronaut {
  firstname: string;
  lastname: string;
  originPlanetId: number;
}

/**
 * Interface for Astronaut entity with ID
 */
export interface Astronaut extends IAstronaut {
  id: number;
}

/**
 * Interface for Astronaut response with planet details
 */
export interface AstronautResponse extends Omit<Astronaut, 'originPlanetId'> {
  originPlanet: PlanetResponse;
}

/**
 * Type for creating a new Astronaut
 */
export type CreateAstronautDto = IAstronaut;

/**
 * Type for updating an Astronaut
 */
export type UpdateAstronautDto = Partial<IAstronaut>;

/**
 * Astronaut entity class
 */
export class AstronautEntity implements Astronaut {
  id: number;
  firstname: string;
  lastname: string;
  originPlanetId: number;

  constructor(data: Astronaut) {
    this.id = data.id;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.originPlanetId = data.originPlanetId;
  }

  /**
   * Creates an AstronautEntity instance from database data
   * @param {any} data - Raw data from database
   * @returns {AstronautEntity} New AstronautEntity instance
   */
  static fromDatabase(data: any): AstronautEntity {
    return new AstronautEntity({
      id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      originPlanetId: data.originPlanetId,
    });
  }

  /**
   * Converts AstronautEntity to a response object with planet details
   * @param {PlanetResponse} planet - Associated planet data with image
   * @returns {AstronautResponse} Response object with planet details
   */
  toResponse(planet: PlanetResponse): AstronautResponse {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      originPlanet: planet,
    };
  }
} 