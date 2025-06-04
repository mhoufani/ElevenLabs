/**
 * Base interface for Image entity
 */
export interface IImage {
  name: string;
  path: string;
}

/**
 * Interface for Image entity with ID
 */
export interface Image extends IImage {
  id: number;
}

/**
 * Type for creating a new Image
 */
export type CreateImageDto = IImage;

/**
 * Type for updating an Image
 */
export type UpdateImageDto = Partial<IImage>;

/**
 * Image entity class
 */
export class ImageEntity implements Image {
  id: number;
  name: string;
  path: string;

  constructor(data: Image) {
    this.id = data.id;
    this.name = data.name;
    this.path = data.path;
  }

  /**
   * Creates an ImageEntity instance from database data
   * @param {any} data - Raw data from database
   * @returns {ImageEntity} New ImageEntity instance
   */
  static fromDatabase(data: any): ImageEntity {
    return new ImageEntity({
      id: data.id,
      name: data.name,
      path: data.path,
    });
  }

  /**
   * Converts ImageEntity to a plain object for response
   * @returns {Image} Plain object representation
   */
  toResponse(): Image {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
    };
  }
} 