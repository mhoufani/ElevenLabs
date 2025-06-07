import { Request, Response } from 'express';
import { AstronautController } from '../infrastructure/http/astronaut.controller';
import { AstronautService } from '../application/astronaut.service';
import { IAstronautEntity } from '../domain/astronaut.entity';
import { IPlanetEntity } from '../../planet/domain/planet.entity';
import { IImageEntity } from '../../image/domain/image.entity';
import Logger from '../../../utils/logger';

// Mock Logger to prevent actual logging during tests
jest.mock('../../../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
}));

describe('AstronautController', () => {
    let astronautController: AstronautController;
    let mockAstronautService: jest.Mocked<AstronautService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

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
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });

        mockRequest = {};
        mockResponse = {
            status: responseStatus,
            json: responseJson
        };

        // Create a properly typed mock service
        const mockRepo = {} as any; // We don't need the actual repository for controller tests
        mockAstronautService = {
            astronautRepository: mockRepo,
            getAstronauts: jest.fn(),
            getAstronautById: jest.fn(),
            createAstronaut: jest.fn(),
            updateAstronaut: jest.fn(),
            deleteAstronaut: jest.fn()
        } as unknown as jest.Mocked<AstronautService>;

        astronautController = new AstronautController(mockAstronautService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAstronauts', () => {
        it('should return all astronauts with 200 status', async () => {
            mockAstronautService.getAstronauts.mockResolvedValue([mockAstronautWithPlanet]);

            await astronautController.getAstronauts(mockRequest as Request, mockResponse as Response);

            expect(mockAstronautService.getAstronauts).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith([mockAstronautWithPlanet]);
            expect(Logger.info).toHaveBeenCalled();
        });

        it('should handle errors and return 500 status', async () => {
            const error = new Error('Database error');
            mockAstronautService.getAstronauts.mockRejectedValue(error);

            await astronautController.getAstronauts(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
            expect(Logger.error).toHaveBeenCalled();
        });
    });

    describe('getAstronautById', () => {
        it('should return astronaut by id with 200 status', async () => {
            mockRequest.params = { id: '1' };
            mockAstronautService.getAstronautById.mockResolvedValue(mockAstronautWithPlanet);

            await astronautController.getAstronautById(mockRequest as Request, mockResponse as Response);

            expect(mockAstronautService.getAstronautById).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockAstronautWithPlanet);
            expect(Logger.info).toHaveBeenCalled();
        });

        it('should return 404 when astronaut not found', async () => {
            mockRequest.params = { id: '999' };
            mockAstronautService.getAstronautById.mockResolvedValue(null);

            await astronautController.getAstronautById(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Astronaut not found' });
            expect(Logger.warn).toHaveBeenCalled();
        });

        it('should handle errors and return 500 status', async () => {
            mockRequest.params = { id: '1' };
            mockAstronautService.getAstronautById.mockRejectedValue(new Error('Database error'));

            await astronautController.getAstronautById(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
            expect(Logger.error).toHaveBeenCalled();
        });
    });

    describe('createAstronaut', () => {
        const createAstronautDto: Omit<IAstronautEntity, 'id'> = {
            firstname: 'Jane',
            lastname: 'Doe',
            originPlanetId: 1
        };

        it('should create astronaut and return 201 status', async () => {
            mockRequest.body = createAstronautDto;
            mockAstronautService.createAstronaut.mockResolvedValue(mockAstronaut);

            await astronautController.createAstronaut(mockRequest as Request, mockResponse as Response);

            expect(mockAstronautService.createAstronaut).toHaveBeenCalledWith(createAstronautDto);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(mockAstronaut);
            expect(Logger.info).toHaveBeenCalled();
        });

        it('should handle errors and return 500 status', async () => {
            mockRequest.body = createAstronautDto;
            mockAstronautService.createAstronaut.mockRejectedValue(new Error('Database error'));

            await astronautController.createAstronaut(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
            expect(Logger.error).toHaveBeenCalled();
        });
    });

    describe('updateAstronaut', () => {
        it('should update astronaut and return 200 status', async () => {
            mockRequest.body = mockAstronaut;
            mockAstronautService.updateAstronaut.mockResolvedValue(mockAstronaut);

            await astronautController.updateAstronaut(mockRequest as Request, mockResponse as Response);

            expect(mockAstronautService.updateAstronaut).toHaveBeenCalledWith(mockAstronaut);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockAstronaut);
            expect(Logger.info).toHaveBeenCalled();
        });

        it('should handle errors and return 500 status', async () => {
            mockRequest.body = mockAstronaut;
            mockAstronautService.updateAstronaut.mockRejectedValue(new Error('Database error'));

            await astronautController.updateAstronaut(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
            expect(Logger.error).toHaveBeenCalled();
        });
    });

    describe('deleteAstronaut', () => {
        it('should delete astronaut and return 200 status', async () => {
            mockRequest.params = { id: '1' };
            mockAstronautService.deleteAstronaut.mockResolvedValue(true);

            await astronautController.deleteAstronaut(mockRequest as Request, mockResponse as Response);

            expect(mockAstronautService.deleteAstronaut).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Astronaut deleted successfully' });
            expect(Logger.info).toHaveBeenCalled();
        });

        it('should return 404 when astronaut not found', async () => {
            mockRequest.params = { id: '999' };
            mockAstronautService.deleteAstronaut.mockResolvedValue(false);

            await astronautController.deleteAstronaut(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Astronaut not found' });
            expect(Logger.warn).toHaveBeenCalled();
        });

        it('should handle errors and return 500 status', async () => {
            mockRequest.params = { id: '1' };
            mockAstronautService.deleteAstronaut.mockRejectedValue(new Error('Database error'));

            await astronautController.deleteAstronaut(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
            expect(Logger.error).toHaveBeenCalled();
        });
    });
}); 