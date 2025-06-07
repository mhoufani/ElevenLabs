import { Knex } from 'knex';
import { MysqlImageRepository } from '../infrastructure/repository/mysql.image.repository';
import { IImageEntity } from '../domain/image.entity';

// Mock type for Knex QueryBuilder
type MockQueryBuilder = {
    select: jest.Mock;
    where: jest.Mock;
    first: jest.Mock;
    insert: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    returning: jest.Mock;
} & Partial<Knex.QueryBuilder>;

describe('MysqlImageRepository', () => {
    let mockKnex: jest.Mocked<Knex>;
    let repository: MysqlImageRepository;
    let queryBuilder: MockQueryBuilder;

    beforeEach(() => {
        // Create mock query builder
        queryBuilder = {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
        } as MockQueryBuilder;

        // Create mock for Knex
        mockKnex = jest.fn().mockReturnValue(queryBuilder) as unknown as jest.Mocked<Knex>;

        repository = new MysqlImageRepository(mockKnex);
    });

    describe('findAll', () => {
        it('should return all images', async () => {
            const mockResults = [{
                id: 1,
                name: 'test.jpg',
                path: '/images/test.jpg'
            }];

            queryBuilder.select.mockImplementationOnce(() => mockResults);

            const result = await repository.findAll();

            expect(result).toEqual(mockResults);
        });

        it('should return empty array when no images found', async () => {
            queryBuilder.select.mockImplementationOnce(() => []);

            const result = await repository.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findById', () => {
        it('should return a single image', async () => {
            const mockResult = {
                id: 1,
                name: 'test.jpg',
                path: '/images/test.jpg'
            };

            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.first.mockImplementationOnce(() => mockResult);

            const result = await repository.findById(1);

            expect(result).toEqual(mockResult);
        });

        it('should return null when image not found', async () => {
            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.first.mockImplementationOnce(() => null);

            const result = await repository.findById(999);
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new image', async () => {
            const newImage: Omit<IImageEntity, 'id'> = {
                name: 'test.jpg',
                path: '/images/test.jpg'
            };

            const mockCreatedImage = { id: 1, ...newImage };

            queryBuilder.insert.mockImplementation(() => queryBuilder);
            queryBuilder.returning.mockImplementationOnce(() => [mockCreatedImage]);

            const result = await repository.create(newImage);

            expect(result).toEqual(mockCreatedImage);
            expect(mockKnex).toHaveBeenCalledWith('images');
            expect(queryBuilder.insert).toHaveBeenCalledWith(newImage);
        });
    });

    describe('update', () => {
        it('should update an existing image', async () => {
            const imageToUpdate: IImageEntity = {
                id: 1,
                name: 'test.jpg',
                path: '/images/test.jpg'
            };

            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.update.mockImplementation(() => queryBuilder);
            queryBuilder.returning.mockImplementationOnce(() => [imageToUpdate]);

            const result = await repository.update(imageToUpdate);

            expect(result).toEqual(imageToUpdate);
            expect(queryBuilder.where).toHaveBeenCalledWith('id', imageToUpdate.id);
            expect(queryBuilder.update).toHaveBeenCalledWith(imageToUpdate);
        });

        it('should return null when image not found', async () => {
            const imageToUpdate: IImageEntity = {
                id: 999,
                name: 'test.jpg',
                path: '/images/test.jpg'
            };

            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.update.mockImplementation(() => queryBuilder);
            queryBuilder.returning.mockImplementationOnce(() => []);

            const result = await repository.update(imageToUpdate);
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete an image', async () => {
            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.delete.mockImplementationOnce(() => 1);

            const result = await repository.delete(1);

            expect(result).toBe(true);
            expect(queryBuilder.where).toHaveBeenCalledWith('id', 1);
        });

        it('should return false even when image not found', async () => {
            queryBuilder.where.mockImplementation(() => queryBuilder);
            queryBuilder.delete.mockImplementationOnce(() => 0);

            const result = await repository.delete(999);

            expect(result).toBe(false);
            expect(queryBuilder.where).toHaveBeenCalledWith('id', 999);
        });
    });
}); 