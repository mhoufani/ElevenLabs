import { IImageEntity } from "../../domain/image.entity";
import { IImageRepository } from "../../domain/image.repository";
import type { Knex } from "knex";

/**
 * Repository layer for images
 * This layer is responsible for the data of the images
 * It uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class MysqlImageRepository implements IImageRepository {
    constructor(private readonly knex: Knex) {
        // constructor injection
    }

    async findAll(): Promise<IImageEntity[]> {
        return this.knex('images').select('*'); // Repository Pattern
    }

    async findById(id: number): Promise<IImageEntity | null> {
        const result = await this.knex('images').where('id', id).first();
        if (!result) return null;
        return result;
    }

    async create(image: Omit<IImageEntity, 'id'>): Promise<IImageEntity> {
        const result = await this.knex('images').insert(image).returning('*');
        return result?.[0] ?? null;
    }

    async update(image: IImageEntity): Promise<IImageEntity | null> {
        const result = await this.knex('images').where('id', image.id).update(image).returning('*');
        return result?.[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.knex('images').where('id', id).delete();
        return result > 0;
    }
}