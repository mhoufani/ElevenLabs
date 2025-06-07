import { IPlanetEntity } from '../domain/planet.entity';

describe('PlanetEntity', () => {
    describe('Interface', () => {
        it('should have all required properties', () => {
            const planet: IPlanetEntity = {
                id: 1,
                name: 'Mars',
                description: 'The Red Planet',
                isHabitable: false,
                imageId: 1
            };

            expect(planet).toHaveProperty('id');
            expect(planet).toHaveProperty('name');
            expect(planet).toHaveProperty('description');
            expect(planet).toHaveProperty('isHabitable');
            expect(planet).toHaveProperty('imageId');
        });

        it('should enforce property types', () => {
            const planet: IPlanetEntity = {
                id: 1,
                name: 'Mars',
                description: 'The Red Planet',
                isHabitable: false,
                imageId: 1
            };

            expect(typeof planet.id).toBe('number');
            expect(typeof planet.name).toBe('string');
            expect(typeof planet.description).toBe('string');
            expect(typeof planet.isHabitable).toBe('boolean');
            expect(typeof planet.imageId).toBe('number');
        });
    });
}); 