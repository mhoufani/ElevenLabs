import { Knex } from 'knex';
import { MysqlAstronautRepository } from '../infrastructure/repository/mysql.astronaut.repository';
import { IAstronautEntity } from '../domain/astronaut.entity';
import { IPlanetEntity } from '../../planet/domain/planet.entity';
import { IImageEntity } from '../../image/domain/image.entity';

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

describe('MysqlAstronautRepository', () => {
    let mockKnex: jest.Mocked<Knex>;
    let repository: MysqlAstronautRepository;
    let queryBuilder: MockQueryBuilder;

    beforeEach(() => {
        // Create mock query builder with chaining
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

        // Create mock for Knex that returns a function with the query builder methods
        mockKnex = jest.fn().mockReturnValue(queryBuilder) as unknown as jest.Mocked<Knex>;

        repository = new MysqlAstronautRepository(mockKnex as unknown as Knex);
    });

    describe('findAll', () => {
        it('should return all astronauts with their planets and images', async () => {
            const mockResults = [{
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                originPlanetId: 1,
                originPlanetName: 'Earth',
                originPlanetDescription: 'Blue Planet',
                originPlanetIsHabitable: true,
                originPlanetImageId: 1,
                originPlanetImageName: 'earth.jpg',
                originPlanetImagePath: '/images/earth.jpg'
            }];

            // Mock the final resolution of the query chain
            queryBuilder.leftJoin.mockImplementationOnce(() => queryBuilder);
            queryBuilder.leftJoin.mockImplementationOnce(() => mockResults);

            const result = await repository.findAll();

            expect(result).toEqual([{
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                originPlanet: {
                    id: 1,
                    name: 'Earth',
                    description: 'Blue Planet',
                    isHabitable: true,
                    image: {
                        id: 1,
                        name: 'earth.jpg',
                        path: '/images/earth.jpg'
                    }
                }
            }]);

            expect(queryBuilder.select).toHaveBeenCalled();
            expect(queryBuilder.leftJoin).toHaveBeenCalledTimes(2);
        });

        it('should return empty array when no astronauts found', async () => {
            // Mock the final resolution of the query chain
            queryBuilder.leftJoin.mockImplementationOnce(() => queryBuilder);
            queryBuilder.leftJoin.mockImplementationOnce(() => []);

            const result = await repository.findAll();
            expect(result).toEqual([]);
            expect(queryBuilder.select).toHaveBeenCalled();
            expect(queryBuilder.leftJoin).toHaveBeenCalledTimes(2);
        });
    });

    describe('findById', () => {
        it('should return a single astronaut with planet and image', async () => {
            const mockResult = {
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                originPlanetId: 1,
                originPlanetName: 'Earth',
                originPlanetDescription: 'Blue Planet',
                originPlanetIsHabitable: true,
                originPlanetImageId: 1,
                originPlanetImageName: 'earth.jpg',
                originPlanetImagePath: '/images/earth.jpg'
            };

            queryBuilder.first.mockResolvedValueOnce(mockResult);

            const result = await repository.findById(1);

            expect(result).toEqual({
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                originPlanet: {
                    id: 1,
                    name: 'Earth',
                    description: 'Blue Planet',
                    isHabitable: true,
                    image: {
                        id: 1,
                        name: 'earth.jpg',
                        path: '/images/earth.jpg'
                    }
                }
            });

            expect(queryBuilder.select).toHaveBeenCalled();
            expect(queryBuilder.where).toHaveBeenCalledWith('astronauts.id', 1);
            expect(queryBuilder.leftJoin).toHaveBeenCalledTimes(2);
            expect(queryBuilder.first).toHaveBeenCalled();
        });

        it('should return null when astronaut not found', async () => {
            queryBuilder.first.mockResolvedValueOnce(null);

            const result = await repository.findById(999);
            expect(result).toBeNull();
            expect(queryBuilder.where).toHaveBeenCalledWith('astronauts.id', 999);
        });
    });

    describe('create', () => {
        it('should create a new astronaut', async () => {
            const newAstronaut: Omit<IAstronautEntity, 'id'> = {
                firstname: 'Jane',
                lastname: 'Doe',
                originPlanetId: 1
            };

            const mockCreatedAstronaut = { id: 1, ...newAstronaut };

            queryBuilder.returning.mockResolvedValueOnce([mockCreatedAstronaut]);

            const result = await repository.create(newAstronaut);

            expect(result).toEqual(mockCreatedAstronaut);
            expect(mockKnex).toHaveBeenCalledWith('astronauts');
            expect(queryBuilder.insert).toHaveBeenCalledWith(newAstronaut);
            expect(queryBuilder.returning).toHaveBeenCalled();
        });

        it('should throw error when creating astronaut with invalid data', async () => {
            const invalidAstronaut = {
                firstname: 'Jane',
                lastname: 'Doe',
                // missing originPlanetId
            };

            queryBuilder.returning.mockRejectedValueOnce(new Error('Invalid data'));

            await expect(repository.create(invalidAstronaut as any)).rejects.toThrow('Invalid data');
        });
    });

    describe('update', () => {
        it('should update an existing astronaut', async () => {
            const astronautToUpdate: IAstronautEntity = {
                id: 1,
                firstname: 'Jane',
                lastname: 'Doe',
                originPlanetId: 1
            };

            queryBuilder.returning.mockResolvedValueOnce([astronautToUpdate]);

            const result = await repository.update(astronautToUpdate);

            expect(result).toEqual(astronautToUpdate);
            expect(mockKnex).toHaveBeenCalledWith('astronauts');
            expect(queryBuilder.where).toHaveBeenCalledWith('id', astronautToUpdate.id);
            expect(queryBuilder.update).toHaveBeenCalledWith(astronautToUpdate);
            expect(queryBuilder.returning).toHaveBeenCalled();
        });

        it('should throw error when updating non-existent astronaut', async () => {
            const nonExistentAstronaut: IAstronautEntity = {
                id: 999,
                firstname: 'Jane',
                lastname: 'Doe',
                originPlanetId: 1
            };

            // Mock the returning call to resolve with an empty array
            queryBuilder.returning.mockImplementation(() => []);

            // The repository should throw an error when no rows are returned

            const result = await repository.update(nonExistentAstronaut);
            expect(result).toBeNull();
            expect(mockKnex).toHaveBeenCalledWith('astronauts');
            expect(queryBuilder.where).toHaveBeenCalledWith('id', nonExistentAstronaut.id);
        });

        it('should throw error when updating with invalid data', async () => {
            const invalidAstronaut = {
                id: 1,
                firstname: 'Jane',
                lastname: 'Doe',
                // missing originPlanetId
            };

            queryBuilder.returning.mockRejectedValueOnce(new Error('Invalid data'));

            await expect(repository.update(invalidAstronaut as any)).rejects.toThrow('Invalid data');
        });
    });

    describe('delete', () => {
        it('should delete an astronaut', async () => {
            queryBuilder.delete.mockResolvedValueOnce(1);

            const result = await repository.delete(1);

            expect(result).toBe(true);
            expect(mockKnex).toHaveBeenCalledWith('astronauts');
            expect(queryBuilder.where).toHaveBeenCalledWith('id', 1);
        });

        it('should return true even when astronaut not found', async () => {
            queryBuilder.delete.mockResolvedValueOnce(0);

            const result = await repository.delete(999);

            expect(result).toBe(true);
            expect(mockKnex).toHaveBeenCalledWith('astronauts');
            expect(queryBuilder.where).toHaveBeenCalledWith('id', 999);
        });
    });
}); 