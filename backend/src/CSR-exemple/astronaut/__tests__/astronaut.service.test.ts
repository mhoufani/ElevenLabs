import { AstronautService } from '../application/astronaut.service';
import { IAstronautRepository } from '../domain/astronaut.repository';
import { IAstronautEntity } from '../domain/astronaut.entity';
import { IPlanetEntity } from '../../planet/domain/planet.entity';
import { IImageEntity } from '../../image/domain/image.entity';

describe('AstronautService', () => {
    let astronautService: AstronautService;
    let mockAstronautRepository: jest.Mocked<IAstronautRepository>;

    const mockImage: IImageEntity = {
        id: 1,
        name: 'test-image.jpg',
        path: '/path/to/image.jpg'
    };

    const mockPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } = {
        id: 1,
        name: 'Mars',
        description: 'Red Planet',
        isHabitable: false,
        image: mockImage
    };

    const mockAstronaut: IAstronautEntity = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        originPlanetId: 1
    };

    const mockAstronautWithPlanet: Omit<IAstronautEntity, 'originPlanetId'> & { 
        originPlanet: Omit<IPlanetEntity, 'imageId'> & { image: IImageEntity } 
    } = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        originPlanet: mockPlanet
    };

    beforeEach(() => {
        mockAstronautRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        astronautService = new AstronautService(mockAstronautRepository);
    });

    describe('getAstronauts', () => {
        it('should return all astronauts with their origin planets', async () => {
            mockAstronautRepository.findAll.mockResolvedValue([mockAstronautWithPlanet]);

            const result = await astronautService.getAstronauts();

            expect(result).toEqual([mockAstronautWithPlanet]);
            expect(mockAstronautRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no astronauts exist', async () => {
            mockAstronautRepository.findAll.mockResolvedValue([]);

            const result = await astronautService.getAstronauts();

            expect(result).toEqual([]);
            expect(mockAstronautRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAstronautById', () => {
        it('should return astronaut by id with origin planet', async () => {
            mockAstronautRepository.findById.mockResolvedValue(mockAstronautWithPlanet);

            const result = await astronautService.getAstronautById(1);

            expect(result).toEqual(mockAstronautWithPlanet);
            expect(mockAstronautRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return null when astronaut not found', async () => {
            mockAstronautRepository.findById.mockResolvedValue(null);

            const result = await astronautService.getAstronautById(999);

            expect(result).toBeNull();
            expect(mockAstronautRepository.findById).toHaveBeenCalledWith(999);
        });
    });

    describe('createAstronaut', () => {
        const createAstronautDto: Omit<IAstronautEntity, 'id'> = {
            firstname: 'Jane',
            lastname: 'Doe',
            originPlanetId: 1
        };

        it('should create and return new astronaut', async () => {
            mockAstronautRepository.create.mockResolvedValue(mockAstronaut);

            const result = await astronautService.createAstronaut(createAstronautDto);

            expect(result).toEqual(mockAstronaut);
            expect(mockAstronautRepository.create).toHaveBeenCalledWith(createAstronautDto);
        });
    });

    describe('updateAstronaut', () => {
        it('should update and return astronaut', async () => {
            mockAstronautRepository.update.mockResolvedValue(mockAstronaut);

            const result = await astronautService.updateAstronaut(mockAstronaut);

            expect(result).toEqual(mockAstronaut);
            expect(mockAstronautRepository.update).toHaveBeenCalledWith(mockAstronaut);
        });

        it('should return null when astronaut not found', async () => {
            mockAstronautRepository.update.mockResolvedValue(null);

            const result = await astronautService.updateAstronaut(mockAstronaut);

            expect(result).toBeNull();
            expect(mockAstronautRepository.update).toHaveBeenCalledWith(mockAstronaut);
        });
    });

    describe('deleteAstronaut', () => {
        it('should return true when astronaut deleted successfully', async () => {
            mockAstronautRepository.delete.mockResolvedValue(true);

            const result = await astronautService.deleteAstronaut(1);

            expect(result).toBe(true);
            expect(mockAstronautRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should return false when astronaut not found', async () => {
            mockAstronautRepository.delete.mockResolvedValue(false);

            const result = await astronautService.deleteAstronaut(999);

            expect(result).toBe(false);
            expect(mockAstronautRepository.delete).toHaveBeenCalledWith(999);
        });
    });
}); 