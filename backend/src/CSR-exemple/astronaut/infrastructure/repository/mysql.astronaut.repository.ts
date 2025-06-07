import { IImageEntity } from "../../../image/domain/image.entity";
import { IAstronautEntity } from "../../domain/astronaut.entity";
import { IAstronautRepository } from "../../domain/astronaut.repository";
import { Knex } from "knex";
import { IPlanetEntity } from "../../../planet/domain/planet.entity";

/**
 * Repository layer for astronauts
 * This layer is responsible for the data of the astronauts
 * It uses the entity layer to map the data to the entity
 * It also uses the repository layer to update the data in the database
 * It also uses the repository layer to delete the data from the database
 * It also uses the repository layer to create the data in the database
 */
export class MysqlAstronautRepository implements IAstronautRepository {
    constructor(private readonly knex: Knex) {}

    async findAll(): Promise<Array<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } }>> {
        const results = await this.knex('astronauts')
        .select(
            'astronauts.id',
            'astronauts.firstname',
            'astronauts.lastname',
            'planets.id as originPlanetId',
            'planets.name as originPlanetName',
            'planets.description as originPlanetDescription',
            'planets.isHabitable as originPlanetIsHabitable',
            'images.id as originPlanetImageId',
            'images.name as originPlanetImageName',
            'images.path as originPlanetImagePath'
        )
        .leftJoin('planets', 'astronauts.originPlanetId', 'planets.id')
        .leftJoin('images', 'planets.imageId', 'images.id');

        return results.map(row => ({
            id: row.id,
            firstname: row.firstname,
            lastname: row.lastname,
            originPlanet: {
                id: row.originPlanetId,
                name: row.originPlanetName,
                description: row.originPlanetDescription,
                isHabitable: row.originPlanetIsHabitable,
                image: {
                    id: row.originPlanetImageId,
                    name: row.originPlanetImageName,
                    path: row.originPlanetImagePath,
                }
            }
        }));
    }

    async findById(id: number): Promise<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } } | null> {
        const result = await this.knex('astronauts')
        .select(
            'astronauts.id',
            'astronauts.firstname',
            'astronauts.lastname',
            'planets.id as originPlanetId',
            'planets.name as originPlanetName',
            'planets.description as originPlanetDescription',
            'planets.isHabitable as originPlanetIsHabitable',
            'images.id as originPlanetImageId',
            'images.name as originPlanetImageName',
            'images.path as originPlanetImagePath'
        )
        .leftJoin('planets', 'astronauts.originPlanetId', 'planets.id')
        .leftJoin('images', 'planets.imageId', 'images.id')
        .where('astronauts.id', id)
        .first();

        return result ? {
            id: result.id,
            firstname: result.firstname,
            lastname: result.lastname,
            originPlanet: {
                id: result.originPlanetId,
                name: result.originPlanetName,
                description: result.originPlanetDescription,
                isHabitable: result.originPlanetIsHabitable,
                image: {
                    id: result.originPlanetImageId,
                    name: result.originPlanetImageName,
                    path: result.originPlanetImagePath
                }
            }
        } : null;
    }

    async create(astronaut: Omit<IAstronautEntity, 'id'>): Promise<IAstronautEntity | null> {
        const [astronautCreated] = await this.knex('astronauts').insert(astronaut).returning('*');
        return astronautCreated ?? null;
    }

    async update(astronaut: IAstronautEntity): Promise<IAstronautEntity | null> {
        const result = await this.knex('astronauts')
        .where('id', astronaut.id)
        .update(astronaut)
        .returning('*')

        return result?.[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        return this.knex('astronauts').where('id', id).delete().then(() => true);
    }
}