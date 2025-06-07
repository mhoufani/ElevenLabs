import { IAstronautRepository } from '../domain/astronaut.repository';
import { IAstronautEntity } from '../domain/astronaut.entity';
import { IPlanetEntity } from '../../planet/domain/planet.entity';
import { IImageEntity } from '../../image/domain/image.entity';

describe('AstronautRepository Interface', () => {
    // Create a mock implementation of the repository interface
    class MockAstronautRepository implements IAstronautRepository {
        private astronauts: IAstronautEntity[] = [];

        async findAll(): Promise<Array<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } }>> {
            return this.astronauts.map(astronaut => ({
                id: astronaut.id,
                firstname: astronaut.firstname,
                lastname: astronaut.lastname,
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
            }));
        }

        async findById(id: number): Promise<Omit<IAstronautEntity, 'originPlanetId'> & { originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } }> {
            const astronaut = this.astronauts.find(a => a.id === id);
            if (!astronaut) throw new Error('Astronaut not found');

            return {
                id: astronaut.id,
                firstname: astronaut.firstname,
                lastname: astronaut.lastname,
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
            };
        }

        async create(astronaut: Omit<IAstronautEntity, 'id'>): Promise<IAstronautEntity> {
            const newAstronaut = {
                ...astronaut,
                id: this.astronauts.length + 1
            };
            this.astronauts.push(newAstronaut);
            return newAstronaut;
        }

        async update(astronaut: IAstronautEntity): Promise<IAstronautEntity> {
            const index = this.astronauts.findIndex(a => a.id === astronaut.id);
            if (index === -1) throw new Error('Astronaut not found');
            
            this.astronauts[index] = astronaut;
            return astronaut;
        }

        async delete(id: number): Promise<boolean> {
            const index = this.astronauts.findIndex(a => a.id === id);
            if (index === -1) return false;
            
            this.astronauts.splice(index, 1);
            return true;
        }
    }

    let repository: IAstronautRepository;

    beforeEach(() => {
        repository = new MockAstronautRepository();
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
            const newAstronaut: Omit<IAstronautEntity, 'id'> = {
                firstname: 'John',
                lastname: 'Doe',
                originPlanetId: 1
            };

            // Test return types
            const created = await repository.create(newAstronaut);
            expect(created).toHaveProperty('id');
            expect(created).toHaveProperty('firstname');
            expect(created).toHaveProperty('lastname');
            expect(created).toHaveProperty('originPlanetId');

            const found = await repository.findById(created!.id);
            expect(found).toHaveProperty('id');
            expect(found).toHaveProperty('firstname');
            expect(found).toHaveProperty('lastname');
            expect(found).toHaveProperty('originPlanet');
            expect(found?.originPlanet).toHaveProperty('image');

            const all = await repository.findAll();
            expect(Array.isArray(all)).toBe(true);
            expect(all[0]).toHaveProperty('originPlanet');
            expect(all[0].originPlanet).toHaveProperty('image');

            const updated = await repository.update(created!);
            expect(updated).toHaveProperty('id');
            expect(updated).toHaveProperty('firstname');
            expect(updated).toHaveProperty('lastname');
            expect(updated).toHaveProperty('originPlanetId');

            const deleted = await repository.delete(created!.id);
            expect(typeof deleted).toBe('boolean');
        });

        it('should handle not found cases', async () => {
            await expect(repository.findById(999)).rejects.toThrow('Astronaut not found');
            await expect(repository.update({ id: 999, firstname: 'John', lastname: 'Doe', originPlanetId: 1 })).rejects.toThrow('Astronaut not found');
            expect(await repository.delete(999)).toBe(false);
        });
    });
}); 