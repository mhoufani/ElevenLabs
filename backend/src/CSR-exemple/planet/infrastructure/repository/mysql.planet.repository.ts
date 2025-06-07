import type { Knex } from "knex";
import { IPlanetRepository } from "../../domain/planet.repository";
import { IPlanetEntity } from "../../domain/planet.entity";
import { IImageEntity } from "../../../image/domain/image.entity";

/**
 * Repository layer for planets
 * This layer is responsible for the data of the planets
 * It uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class MysqlPlanetRepository implements IPlanetRepository {
    constructor(private readonly knex: Knex) {
        // constructor injection
    }

    async findAll(params?: { filterName?: string }): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity }[]> {
        const { filterName } = params ?? {};
        const query = this.knex('planets').select('*').leftJoin('images', 'planets.imageId', 'images.id');
        if (filterName) {
            query.where('planets.name', 'like', `%${filterName}%`);
        }
        const result = await query;
        return result?.map(row => {
            return {
                id: row.id,
                name: row.name,
                description: row.description,
                isHabitable: row.isHabitable,
                image: {
                    id: row.imageId,
                    name: row.imageName,
                    path: row.imagePath
                }
            }
        }) as unknown as Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity }[]>;
    }

    async findById(id: number): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } | null> {
        const result = await this.knex('planets').where('id', id).first();
        if (!result) return null;
        return {
            id: result.id,
            name: result.name,
            description: result.description,
            isHabitable: result.isHabitable,
            image: {
                id: result.imageId,
                name: result.imageName,
                path: result.imagePath
            }
        } as unknown as Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity }>;
    }

    async create(planet: Omit<IPlanetEntity, 'id'>): Promise<IPlanetEntity> {
        const result = await this.knex('planets').insert(planet).returning('*');
        return result?.[0] ?? null;
    }

    async update(planet: IPlanetEntity): Promise<IPlanetEntity | null> {
        const result = await this.knex('planets').where('id', planet.id).update(planet).returning('*');
        return result?.[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        return this.knex('planets').where('id', id).delete().then(() => true);
    }
}