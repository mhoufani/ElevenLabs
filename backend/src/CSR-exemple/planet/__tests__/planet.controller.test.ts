import { Request, Response } from 'express';
import { PlanetController } from '../infrastructure/http/planet.controller';
import { PlanetService } from '../application/planet.service';
import { IPlanetEntity } from '../domain/planet.entity';
import { IImageEntity } from '../../image/domain/image.entity';
import Logger from '../../../utils/logger';

// Mock Logger to prevent actual logging during tests
jest.mock('../../../utils/logger');

describe('PlanetController', () => {
    let planetController: PlanetController;
    let mockPlanetService: jest.Mocked<PlanetService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

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

    const mockPlanetWithImage = {
        id: 1,
        name: 'Earth',
        description: 'Blue Planet',
        isHabitable: true,
        image: mockImage
    };

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock service
        mockPlanetService = {
            getPlanets: jest.fn(),
            getPlanetById: jest.fn(),
            createPlanet: jest.fn(),
            updatePlanet: jest.fn(),
            deletePlanet: jest.fn(),
        } as unknown as jest.Mocked<PlanetService>;

        // Create mock request and response
        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });
        mockResponse = {
            status: responseStatus,
            json: responseJson,
        };

        mockRequest = {};

        planetController = new PlanetController(mockPlanetService);
    });

    describe('getPlanets', () => {
        it('should return all planets with 200 status code', async () => {
            mockPlanetService.getPlanets.mockResolvedValue([mockPlanetWithImage] as any);

            await planetController.getPlanets(mockRequest as Request, mockResponse as Response);

            expect(mockPlanetService.getPlanets).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith([mockPlanetWithImage]);
            expect(Logger.info).toHaveBeenCalledWith('PlanetController.getPlanets', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockPlanetService.getPlanets.mockRejectedValue(error);

            await planetController.getPlanets(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('PlanetController.getPlanets', 'Failed to fetch planets', error);
        });
    });

    describe('getPlanetById', () => {
        beforeEach(() => {
            mockRequest.params = { id: '1' };
        });

        it('should return a planet when found with 200 status code', async () => {
            mockPlanetService.getPlanetById.mockResolvedValue(mockPlanetWithImage);

            await planetController.getPlanetById(mockRequest as Request, mockResponse as Response);

            expect(mockPlanetService.getPlanetById).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockPlanetWithImage);
            expect(Logger.info).toHaveBeenCalledWith('PlanetController.getPlanetById', expect.any(String));
        });

        it('should return 404 when planet is not found', async () => {
            mockPlanetService.getPlanetById.mockResolvedValue(null);

            await planetController.getPlanetById(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Planet not found' });
            expect(Logger.warn).toHaveBeenCalledWith('PlanetController.getPlanetById', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockPlanetService.getPlanetById.mockRejectedValue(error);

            await planetController.getPlanetById(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('PlanetController.getPlanetById', 'Failed to fetch planet', error);
        });
    });

    describe('createPlanet', () => {
        const newPlanet = {
            name: 'Mars',
            description: 'Red Planet',
            isHabitable: false,
            imageId: 2
        };

        beforeEach(() => {
            mockRequest.body = newPlanet;
        });

        it('should create a planet and return 201 status code', async () => {
            const createdPlanet = { ...newPlanet, id: 2 };
            mockPlanetService.createPlanet.mockResolvedValue(createdPlanet);

            await planetController.createPlanet(mockRequest as Request, mockResponse as Response);

            expect(mockPlanetService.createPlanet).toHaveBeenCalledWith(newPlanet);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(createdPlanet);
            expect(Logger.info).toHaveBeenCalledWith('PlanetController.createPlanet', expect.any(String));
        });

        it('should return 400 when creation fails', async () => {
            mockPlanetService.createPlanet.mockResolvedValue(null);

            await planetController.createPlanet(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to create planet' });
            expect(Logger.warn).toHaveBeenCalledWith('PlanetController.createPlanet', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockPlanetService.createPlanet.mockRejectedValue(error);

            await planetController.createPlanet(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('PlanetController.createPlanet', 'Failed to create planet', error);
        });
    });

    describe('updatePlanet', () => {
        const updatedPlanet = {
            id: 1,
            name: 'Earth Updated',
            description: 'Blue Planet Updated',
            isHabitable: true,
            imageId: 1
        };

        beforeEach(() => {
            mockRequest.body = updatedPlanet;
        });

        it('should update a planet and return 200 status code', async () => {
            mockPlanetService.updatePlanet.mockResolvedValue(updatedPlanet);

            await planetController.updatePlanet(mockRequest as Request, mockResponse as Response);

            expect(mockPlanetService.updatePlanet).toHaveBeenCalledWith(updatedPlanet);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(updatedPlanet);
            expect(Logger.info).toHaveBeenCalledWith('PlanetController.updatePlanet', expect.any(String));
        });

        it('should return 400 when update fails', async () => {
            mockPlanetService.updatePlanet.mockResolvedValue(null);

            await planetController.updatePlanet(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to update planet' });
            expect(Logger.warn).toHaveBeenCalledWith('PlanetController.updatePlanet', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockPlanetService.updatePlanet.mockRejectedValue(error);

            await planetController.updatePlanet(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('PlanetController.updatePlanet', 'Failed to update planet', error);
        });
    });

    describe('deletePlanet', () => {
        beforeEach(() => {
            mockRequest.params = { id: '1' };
        });

        it('should delete a planet and return 200 status code', async () => {
            mockPlanetService.deletePlanet.mockResolvedValue(true);

            await planetController.deletePlanet(mockRequest as Request, mockResponse as Response);

            expect(mockPlanetService.deletePlanet).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Planet deleted successfully' });
            expect(Logger.info).toHaveBeenCalledWith('PlanetController.deletePlanet', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockPlanetService.deletePlanet.mockRejectedValue(error);

            await planetController.deletePlanet(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('PlanetController.deletePlanet', 'Failed to delete planet', error);
        });
    });
}); 