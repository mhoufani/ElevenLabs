import { IImageEntity } from "../domain/image.entity";
import { IImageRepository } from "../domain/image.repository";

/**
 * Service layer for images
 * This layer is responsible for the business logic of the images
 * It uses the repository layer to get the data from the database
 * It also uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class ImageService {
    constructor(private readonly imageRepository: IImageRepository) {}

    async getImages(): Promise<IImageEntity[]> {
        const images = await this.imageRepository.findAll();
        return images;
    }

    async getImageById(id: number): Promise<IImageEntity | null> {
        const image = await this.imageRepository.findById(id);
        return image ?? null;
    }

    async createImage(image: Omit<IImageEntity, 'id'>): Promise<IImageEntity | null> {
        const createdImage = await this.imageRepository.create(image);
        return createdImage ?? null;
    }

    async updateImage(image: IImageEntity): Promise<IImageEntity | null> {
        const updatedImage = await this.imageRepository.update(image);
        return updatedImage ?? null;
    }

    async deleteImage(id: number): Promise<boolean> {
        const deleted = await this.imageRepository.delete(id);
        return deleted ?? false;
    }
}