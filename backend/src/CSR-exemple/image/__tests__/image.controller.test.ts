import { Request, Response } from 'express';
import { ImageController } from '../infrastructure/http/image.controller';
import { ImageService } from '../application/image.service';
import { IImageEntity } from '../domain/image.entity';
import Logger from '../../../utils/logger';

// Mock Logger to prevent actual logging during tests
jest.mock('../../../utils/logger');

describe('ImageController', () => {
    let imageController: ImageController;
    let mockImageService: jest.Mocked<ImageService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;
    let responseSend: jest.Mock;

    const mockImage: IImageEntity = {
        id: 1,
        name: 'test.jpg',
        path: '/images/test.jpg'
    };

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock service
        mockImageService = {
            getImages: jest.fn(),
            getImageById: jest.fn(),
            createImage: jest.fn(),
            updateImage: jest.fn(),
            deleteImage: jest.fn(),
        } as unknown as jest.Mocked<ImageService>;

        // Create mock request and response
        responseJson = jest.fn();
        responseSend = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson, send: responseSend });
        mockResponse = {
            status: responseStatus,
            json: responseJson,
            send: responseSend,
        };

        mockRequest = {};

        imageController = new ImageController(mockImageService);
    });

    describe('getImages', () => {
        it('should return all images with 200 status code', async () => {
            mockImageService.getImages.mockResolvedValue([mockImage]);

            await imageController.getImages(mockRequest as Request, mockResponse as Response);

            expect(mockImageService.getImages).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith([mockImage]);
            expect(Logger.info).toHaveBeenCalledWith('ImageController.getImages', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockImageService.getImages.mockRejectedValue(error);

            await imageController.getImages(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('ImageController.getImages', 'Failed to fetch images', error);
        });
    });

    describe('getImageById', () => {
        beforeEach(() => {
            mockRequest.params = { id: '1' };
        });

        it('should return an image when found with 200 status code', async () => {
            mockImageService.getImageById.mockResolvedValue(mockImage);

            await imageController.getImageById(mockRequest as Request, mockResponse as Response);

            expect(mockImageService.getImageById).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockImage);
            expect(Logger.info).toHaveBeenCalledWith('ImageController.getImageById', expect.any(String));
        });

        it('should return 404 when image is not found', async () => {
            mockImageService.getImageById.mockResolvedValue(null);

            await imageController.getImageById(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Image not found' });
            expect(Logger.warn).toHaveBeenCalledWith('ImageController.getImageById', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockImageService.getImageById.mockRejectedValue(error);

            await imageController.getImageById(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('ImageController.getImageById', 'Failed to fetch image', error);
        });
    });

    describe('createImage', () => {
        const newImage: Omit<IImageEntity, 'id'> = {
            name: 'new.jpg',
            path: '/images/new.jpg'
        };

        beforeEach(() => {
            mockRequest.body = newImage;
        });

        it('should create an image and return 201 status code', async () => {
            const createdImage: IImageEntity = { ...newImage, id: 2 };
            mockImageService.createImage.mockResolvedValue(createdImage);

            await imageController.createImage(mockRequest as Request, mockResponse as Response);

            expect(mockImageService.createImage).toHaveBeenCalledWith(newImage);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(createdImage);
            expect(Logger.info).toHaveBeenCalledWith('ImageController.createImage', expect.any(String));
        });

        it('should return 400 when creation fails', async () => {
            mockImageService.createImage.mockResolvedValue(null);

            await imageController.createImage(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to create image' });
            expect(Logger.warn).toHaveBeenCalledWith('ImageController.createImage', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockImageService.createImage.mockRejectedValue(error);

            await imageController.createImage(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('ImageController.createImage', 'Failed to create image', error);
        });
    });

    describe('updateImage', () => {
        const updatedImage: IImageEntity = {
            id: 1,
            name: 'updated.jpg',
            path: '/images/updated.jpg'
        };

        beforeEach(() => {
            mockRequest.body = updatedImage;
        });

        it('should update an image and return 200 status code', async () => {
            mockImageService.updateImage.mockResolvedValue(updatedImage);

            await imageController.updateImage(mockRequest as Request, mockResponse as Response);

            expect(mockImageService.updateImage).toHaveBeenCalledWith(updatedImage);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(updatedImage);
            expect(Logger.info).toHaveBeenCalledWith('ImageController.updateImage', expect.any(String));
        });

        it('should return 400 when update fails', async () => {
            mockImageService.updateImage.mockResolvedValue(null);

            await imageController.updateImage(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to update image' });
            expect(Logger.warn).toHaveBeenCalledWith('ImageController.updateImage', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockImageService.updateImage.mockRejectedValue(error);

            await imageController.updateImage(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('ImageController.updateImage', 'Failed to update image', error);
        });
    });

    describe('deleteImage', () => {
        beforeEach(() => {
            mockRequest.params = { id: '1' };
        });

        it('should delete an image and return 204 status code', async () => {
            mockImageService.deleteImage.mockResolvedValue(true);

            await imageController.deleteImage(mockRequest as Request, mockResponse as Response);

            expect(mockImageService.deleteImage).toHaveBeenCalledWith(1);
            expect(responseStatus).toHaveBeenCalledWith(204);
            expect(responseSend).toHaveBeenCalled();
            expect(Logger.info).toHaveBeenCalledWith('ImageController.deleteImage', expect.any(String));
        });

        it('should return 404 when image is not found', async () => {
            mockImageService.deleteImage.mockResolvedValue(false);

            await imageController.deleteImage(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Image not found' });
            expect(Logger.warn).toHaveBeenCalledWith('ImageController.deleteImage', expect.any(String));
        });

        it('should handle errors and return 500 status code', async () => {
            const error = new Error('Database error');
            mockImageService.deleteImage.mockRejectedValue(error);

            await imageController.deleteImage(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
            expect(Logger.error).toHaveBeenCalledWith('ImageController.deleteImage', 'Failed to delete image', error);
        });
    });
}); 