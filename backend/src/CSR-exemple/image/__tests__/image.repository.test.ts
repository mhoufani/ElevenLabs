import { IImageRepository } from '../domain/image.repository';
import { IImageEntity } from '../domain/image.entity';

describe('ImageRepository Interface', () => {
    // Create a mock implementation of the repository interface
    class MockImageRepository implements IImageRepository {
        private images: IImageEntity[] = [];

        async findAll(): Promise<IImageEntity[]> {
            return this.images;
        }

        async findById(id: number): Promise<IImageEntity> {
            const image = this.images.find(i => i.id === id);
            if (!image) throw new Error('Image not found');
            return image;
        }

        async create(image: Omit<IImageEntity, 'id'>): Promise<IImageEntity> {
            const newImage = {
                id: this.images.length + 1,
                ...image
            };
            this.images.push(newImage);
            return newImage;
        }

        async update(image: IImageEntity): Promise<IImageEntity> {
            const index = this.images.findIndex(i => i.id === image.id);
            if (index === -1) throw new Error('Image not found');
            
            this.images[index] = image;
            return image;
        }

        async delete(id: number): Promise<boolean> {
            const index = this.images.findIndex(i => i.id === id);
            if (index === -1) return false;
            
            this.images.splice(index, 1);
            return true;
        }
    }

    let repository: IImageRepository;

    beforeEach(() => {
        repository = new MockImageRepository();
    });

    describe('Interface Methods', () => {
        it('should implement all required methods', () => {
            expect(repository.findAll).toBeDefined();
            expect(repository.findById).toBeDefined();
            expect(repository.create).toBeDefined();
            expect(repository.update).toBeDefined();
            expect(repository.delete).toBeDefined();
        });

        it('should maintain correct method signatures', async () => {
            const newImage: Omit<IImageEntity, 'id'> = {
                name: 'test.jpg',
                path: '/images/test.jpg'
            };

            // Test return types
            const created = await repository.create(newImage);
            expect(created).toHaveProperty('id');
            expect(created).toHaveProperty('name');
            expect(created).toHaveProperty('path');

            const found = await repository.findById(created?.id ?? 0);
            expect(found).toHaveProperty('id');
            expect(found).toHaveProperty('name');
            expect(found).toHaveProperty('path');

            const all = await repository.findAll();
            expect(Array.isArray(all)).toBe(true);
            if (all.length > 0) {
                expect(all[0]).toHaveProperty('id');
                expect(all[0]).toHaveProperty('name');
                expect(all[0]).toHaveProperty('path');
            }

            const updated = await repository.update(created ?? { id: 0, name: '', path: '' });
            expect(updated).toHaveProperty('id');
            expect(updated).toHaveProperty('name');
            expect(updated).toHaveProperty('path');

            const deleted = await repository.delete(created?.id ?? 0);
            expect(typeof deleted).toBe('boolean');
        });

        it('should handle not found cases', async () => {
            const notFoundId = 999;
            await expect(repository.findById(notFoundId)).rejects.toThrow('Image not found');
            await expect(repository.update({
                id: notFoundId,
                name: 'test.jpg',
                path: '/images/test.jpg'
            } as IImageEntity)).rejects.toThrow('Image not found');
            expect(await repository.delete(notFoundId)).toBe(false);
        });
    });
}); 