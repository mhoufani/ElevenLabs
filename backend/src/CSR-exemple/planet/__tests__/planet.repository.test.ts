import { IPlanetRepository } from '../domain/planet.repository';
import { IPlanetEntity } from '../domain/planet.entity';
import { IImageEntity } from '../../image/domain/image.entity';

describe('PlanetRepository Interface', () => {
    class MockPlanetRepository implements IPlanetRepository {
        private planets: IPlanetEntity[] = [];
        private images: IImageEntity[] = [
            { id: 1, name: 'mars.jpg', path: '/images/mars.jpg' }
        ];

        async findAll(): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity }[]> {
            const results = this.planets.map(planet => ({
                id: planet.id,
                name: planet.name,
                description: planet.description,
                isHabitable: planet.isHabitable,
                image: this.images.find(img => img.id === planet.imageId) || this.images[0]
            }));
            return results as any;
        }

        async findById(id: number): Promise<Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity }> {
            const planet = this.planets.find(p => p.id === id);
            if (!planet) throw new Error('Planet not found');
            
            return {
                id: planet.id,
                name: planet.name,
                description: planet.description,
                isHabitable: planet.isHabitable,
                image: this.images.find(img => img.id === planet.imageId) || this.images[0]
            } as any;
        }

        async create(planet: Omit<IPlanetEntity, 'id'>): Promise<IPlanetEntity> {
            const newPlanet = {
                id: this.planets.length + 1,
                ...planet
            };
            this.planets.push(newPlanet);
            return newPlanet;
        }

        async update(planet: IPlanetEntity): Promise<IPlanetEntity> {
            const index = this.planets.findIndex(p => p.id === planet.id);
            if (index === -1) throw new Error('Planet not found');
            
            this.planets[index] = planet;
            return planet;
        }

        async delete(id: number): Promise<boolean> {
            const index = this.planets.findIndex(p => p.id === id);
            if (index === -1) return false;
            
            this.planets.splice(index, 1);
            return true;
        }
    }

    let repository: IPlanetRepository;

    beforeEach(() => {
        repository = new MockPlanetRepository();
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
            const newPlanet: Omit<IPlanetEntity, 'id'> = {
                name: 'Mars',
                description: 'The Red Planet',
                isHabitable: false,
                imageId: 1
            };

            const created = await repository.create(newPlanet);
            expect(created).toHaveProperty('id');
            expect(created).toHaveProperty('name');
            expect(created).toHaveProperty('description');
            expect(created).toHaveProperty('isHabitable');
            expect(created).toHaveProperty('imageId');

            const found = await repository.findById(created.id);
            expect(found).toHaveProperty('id');
            expect(found).toHaveProperty('name');
            expect(found).toHaveProperty('description');
            expect(found).toHaveProperty('isHabitable');
            expect(found).toHaveProperty('image');
            expect(found?.image).toHaveProperty('id');
            expect(found?.image).toHaveProperty('name');
            expect(found?.image).toHaveProperty('path');

            const all = await repository.findAll();
            expect(Array.isArray(all)).toBe(true);
            if (all.length > 0) {
                expect(all[0]).toHaveProperty('id');
                expect(all[0]).toHaveProperty('name');
                expect(all[0]).toHaveProperty('description');
                expect(all[0]).toHaveProperty('isHabitable');
                expect(all[0]).toHaveProperty('image');
                expect(all[0].image).toHaveProperty('id');
                expect(all[0].image).toHaveProperty('name');
                expect(all[0].image).toHaveProperty('path');
            }

            const updated = await repository.update(created);
            expect(updated).toHaveProperty('id');
            expect(updated).toHaveProperty('name');
            expect(updated).toHaveProperty('description');
            expect(updated).toHaveProperty('isHabitable');
            expect(updated).toHaveProperty('imageId');

            const deleted = await repository.delete(created.id);
            expect(typeof deleted).toBe('boolean');
        });

        it('should handle not found cases', async () => {
            const notFoundId = 999;
            await expect(repository.findById(notFoundId)).rejects.toThrow('Planet not found');
            await expect(repository.update({
                id: notFoundId,
                name: 'Mars',
                description: 'The Red Planet',
                isHabitable: false,
                imageId: 1
            })).rejects.toThrow('Planet not found');
            expect(await repository.delete(notFoundId)).toBe(false);
        });
    });
}); 