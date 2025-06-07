import { IImageEntity } from '../domain/image.entity';

describe('ImageEntity', () => {
    describe('Interface', () => {
        it('should have all required properties', () => {
            const image: IImageEntity = {
                id: 1,
                name: 'test.jpg',
                path: '/images/test.jpg'
            };

            expect(image).toHaveProperty('id');
            expect(image).toHaveProperty('name');
            expect(image).toHaveProperty('path');
        });

        it('should enforce property types', () => {
            const image: IImageEntity = {
                id: 1,
                name: 'test.jpg',
                path: '/images/test.jpg'
            };

            expect(typeof image.id).toBe('number');
            expect(typeof image.name).toBe('string');
            expect(typeof image.path).toBe('string');
        });
    });
}); 