import { Knex } from 'knex';
import { MysqlPlanetRepository } from '../infrastructure/repository/mysql.planet.repository';
import { IPlanetEntity } from '../domain/planet.entity';

// Mock type for Knex QueryBuilder
type MockQueryBuilder = {
    select: jest.Mock;
    leftJoin: jest.Mock;
    where: jest.Mock;
    first: jest.Mock;
    insert: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    returning: jest.Mock;
} & Partial<Knex.QueryBuilder>;

describe('MysqlPlanetRepository', () => {
    let mockKnex: jest.Mocked<Knex>;
    let repository: MysqlPlanetRepository;
    let queryBuilder: MockQueryBuilder;

    beforeEach(() => {
        // Create mock query builder
        queryBuilder = {
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
        } as MockQueryBuilder;

        // Create mock for Knex
        mockKnex = jest.fn().mockReturnValue(queryBuilder) as unknown as jest.Mocked<Knex>;

        repository = new MysqlPlanetRepository(mockKnex);
    });

    describe('findAll', () => {
        it('should return all planets with their images', async () => {
            const mockResults = [{
                id: 1,
                name: 'Earth',
                description: 'Blue Planet',
                isHabitable: true,
                imageId: 1,
                imageName: 'earth.jpg',
                imagePath: '/images/earth.jpg'
            }];

            queryBuilder.leftJoin.mockImplementationOnce(() => mockResults);

            const result = await repository.findAll();

            expect(result).toEqual([{
                id: 1,
                name: 'Earth',
                description: 'Blue Planet',
                isHabitable: true,
                image: {
                    id: 1,
                    name: 'earth.jpg',
                    path: '/images/earth.jpg'
                }
            }]);
        });

        it('should return empty array when no planets found', async () => {
            queryBuilder.leftJoin.mockImplementationOnce(() => []);
            const result = await repository.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findById', () => {
        it('should return a single planet with image', async () => {
            const mockResult = {
                id: 1,
                name: 'Earth',
                description: 'Blue Planet',
                isHabitable: true,
                imageId: 1,
                imageName: 'earth.jpg',
                imagePath: '/images/earth.jpg'
            };

            queryBuilder.leftJoin.mockImplementationOnce(() => queryBuilder);
            queryBuilder.leftJoin.mockImplementationOnce(() => queryBuilder);
            queryBuilder.first.mockResolvedValueOnce(mockResult);

            const result = await repository.findById(1);

            expect(result).toEqual({
                id: 1,
                name: 'Earth',
                description: 'Blue Planet',
                isHabitable: true,
                image: {
                    id: 1,
                    name: 'earth.jpg',
                    path: '/images/earth.jpg'
                }
            });
        });

        it('should return null when planet not found', async () => {
            queryBuilder.leftJoin.mockImplementationOnce(() => queryBuilder);
            queryBuilder.leftJoin.mockImplementationOnce(() => queryBuilder);
            queryBuilder.first.mockResolvedValueOnce(null);

            const result = await repository.findById(999);
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new planet', async () => {
            const newPlanet: Omit<IPlanetEntity, 'id'> = {
                name: 'Mars',
                description: 'Red Planet',
                isHabitable: false,
                imageId: 2
            };

            const mockCreatedPlanet = { id: 1, ...newPlanet };

            queryBuilder.insert.mockImplementationOnce(() => queryBuilder);
            queryBuilder.returning.mockResolvedValueOnce([mockCreatedPlanet]);

            const result = await repository.create(newPlanet);

            expect(result).toEqual(mockCreatedPlanet);
            expect(queryBuilder.insert).toHaveBeenCalledWith(newPlanet);
        });

        it('should throw error when creating planet with invalid data', async () => {
            const invalidPlanet = {
                name: 'Mars',
                description: 'Red Planet',
                // missing isHabitable and imageId
            };

            queryBuilder.insert.mockImplementationOnce(() => queryBuilder);
            queryBuilder.returning.mockRejectedValueOnce(new Error('Invalid data'));

            await expect(repository.create(invalidPlanet as any)).rejects.toThrow('Invalid data');
        });
    });

    describe('update', () => {
        it('should update an existing planet', async () => {
            const planetToUpdate: IPlanetEntity = {
                id: 1,
                name: 'Mars',
                description: 'Red Planet',
                isHabitable: false,
                imageId: 2
            };

            queryBuilder.where.mockImplementationOnce(() => queryBuilder);
            queryBuilder.update.mockImplementationOnce(() => queryBuilder);
            queryBuilder.returning.mockResolvedValueOnce([planetToUpdate]);

            const result = await repository.update(planetToUpdate);

            expect(result).toEqual(planetToUpdate);
            expect(queryBuilder.where).toHaveBeenCalledWith('id', planetToUpdate.id);
            expect(queryBuilder.update).toHaveBeenCalledWith(planetToUpdate);
        });

        it('should throw error when updating non-existent planet', async () => {
            const nonExistentPlanet: IPlanetEntity = {
                id: 999,
                name: 'Mars',
                description: 'Red Planet',
                isHabitable: false,
                imageId: 2
            };

            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.update.mockImplementation(() => queryBuilder);
            queryBuilder.returning.mockResolvedValue([]);

            const result = await repository.update(nonExistentPlanet);
            expect(result).toBeNull();
        });

        it('should throw error when updating with invalid data', async () => {
            const invalidPlanet = {
                id: 1,
                name: 'Mars',
                description: 'Red Planet',
                // missing isHabitable and imageId
            };

            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.update.mockImplementation(() => queryBuilder);
            queryBuilder.returning.mockRejectedValue(new Error('Invalid data'));

            await expect(repository.update(invalidPlanet as any)).rejects.toThrow('Invalid data');
        });
    });

    describe('delete', () => {
        it('should delete a planet', async () => {
            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.delete.mockResolvedValue(1);

            const result = await repository.delete(1);

            expect(result).toBe(true);
            expect(queryBuilder.where).toHaveBeenCalledWith('id', 1);
        });

        it('should return true even when planet not found', async () => {
            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.delete.mockResolvedValue(0);

            const result = await repository.delete(999);

            expect(result).toBe(true);
            expect(queryBuilder.where).toHaveBeenCalledWith('id', 999);
        });
    });
}); 