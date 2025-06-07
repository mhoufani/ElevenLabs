import { IPlanetRepository } from '../domain/planet.repository';
import { PlanetService } from '../application/planet.service';
import { IPlanetEntity } from '../domain/planet.entity';
import { IImageEntity } from '../../image/domain/image.entity';

describe('PlanetService', () => {
    let planetService: PlanetService;
    let mockPlanetRepository: jest.Mocked<IPlanetRepository>;

    const mockImage: IImageEntity = {
        id: 1,
        name: 'earth.jpg',
        path: '/images/earth.jpg'
    };

    const mockPlanet: IPlanetEntity = {
        id: 1,
        name: 'Earth',
        description: 'Blue Planet',
        isHabitable: true,
        imageId: 1
    };

    type PlanetWithImage = Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity };

    const mockPlanetWithImage: PlanetWithImage = {
        id: 1,
        name: 'Earth',
        description: 'Blue Planet',
        isHabitable: true,
        image: mockImage
    };

    beforeEach(() => {
        mockPlanetRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        planetService = new PlanetService(mockPlanetRepository);
    });

    describe('getPlanets', () => {
        it('should return all planets with their images', async () => {
            mockPlanetRepository.findAll.mockResolvedValue([mockPlanetWithImage] as any);

            const result = await planetService.getPlanets();

            expect(result).toEqual([mockPlanetWithImage]);
            expect(mockPlanetRepository.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no planets exist', async () => {
            mockPlanetRepository.findAll.mockResolvedValue([] as any);

            const result = await planetService.getPlanets();

            expect(result).toEqual([]);
            expect(mockPlanetRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('getPlanetById', () => {
        it('should return a planet with its image when found', async () => {
            mockPlanetRepository.findById.mockResolvedValue(mockPlanetWithImage);

            const result = await planetService.getPlanetById(1);

            expect(result).toEqual(mockPlanetWithImage);
            expect(mockPlanetRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return null when planet is not found', async () => {
            mockPlanetRepository.findById.mockResolvedValue(null);

            const result = await planetService.getPlanetById(999);

            expect(result).toBeNull();
            expect(mockPlanetRepository.findById).toHaveBeenCalledWith(999);
        });
    });

    describe('createPlanet', () => {
        const newPlanet: Omit<IPlanetEntity, 'id'> = {
            name: 'Mars',
            description: 'Red Planet',
            isHabitable: false,
            imageId: 2
        };

        it('should create and return a new planet', async () => {
            const createdPlanet: IPlanetEntity = { ...newPlanet, id: 2 };
            mockPlanetRepository.create.mockResolvedValue(createdPlanet);

            const result = await planetService.createPlanet(newPlanet);

            expect(result).toEqual(createdPlanet);
            expect(mockPlanetRepository.create).toHaveBeenCalledWith(newPlanet);
        });

        it('should handle errors during creation', async () => {
            mockPlanetRepository.create.mockRejectedValue(new Error('Database error'));

            await expect(planetService.createPlanet(newPlanet)).rejects.toThrow('Database error');
            expect(mockPlanetRepository.create).toHaveBeenCalledWith(newPlanet);
        });
    });

    describe('updatePlanet', () => {
        const updatedPlanet: IPlanetEntity = {
            id: 1,
            name: 'Earth Updated',
            description: 'Blue Planet Updated',
            isHabitable: true,
            imageId: 1
        };

        it('should update and return the planet', async () => {
            mockPlanetRepository.update.mockResolvedValue(updatedPlanet);

            const result = await planetService.updatePlanet(updatedPlanet);

            expect(result).toEqual(updatedPlanet);
            expect(mockPlanetRepository.update).toHaveBeenCalledWith(updatedPlanet);
        });

        it('should return null when planet is not found', async () => {
            mockPlanetRepository.update.mockResolvedValue(null);

            const result = await planetService.updatePlanet(updatedPlanet);

            expect(result).toBeNull();
            expect(mockPlanetRepository.update).toHaveBeenCalledWith(updatedPlanet);
        });
    });

    describe('deletePlanet', () => {
        it('should return true when planet is successfully deleted', async () => {
            mockPlanetRepository.delete.mockResolvedValue(true);

            const result = await planetService.deletePlanet(1);

            expect(result).toBe(true);
            expect(mockPlanetRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should return false when planet is not found', async () => {
            mockPlanetRepository.delete.mockResolvedValue(false);

            const result = await planetService.deletePlanet(999);

            expect(result).toBe(false);
            expect(mockPlanetRepository.delete).toHaveBeenCalledWith(999);
        });
    });
}); 