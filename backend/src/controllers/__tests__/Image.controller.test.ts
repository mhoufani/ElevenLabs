import { Request, Response } from 'express';
import ImageController from '../../controllers/Image.controller';
import knex from '../../db';
import Logger from '../../utils/logger';

// Mock the database
jest.mock('../../db', () => {
  return jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn()
  });
});

jest.mock('../../utils/logger', () => {
    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };
    return {
      LogLevel: {
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        DEBUG: 'DEBUG'
      },
      __esModule: true,
      default: mockLogger
    };
  });   

describe('ImageController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockKnexInstance: {
    select: jest.Mock;
    where: jest.Mock;
    first: jest.Mock;
  };

  const mockImageData = {
    id: 1,
    name: 'earth.jpg',
    path: '/images/earth.jpg'
  };

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {
      params: {},
      query: {}
    };
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
    // Reset knex mock for each test
    jest.clearAllMocks();
    mockKnexInstance = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn()
    };
    (jest.mocked(knex) as unknown as jest.Mock).mockReturnValue(mockKnexInstance);
  });

  describe('getById', () => {
    it('should return an image when valid ID is provided', async () => {
      mockRequest.params = { id: '1' };
      mockKnexInstance.first.mockResolvedValue(mockImageData);

      await ImageController.getById(mockRequest as Request, mockResponse as Response);

      expect(knex).toHaveBeenCalledWith('images');
      expect(mockKnexInstance.where).toHaveBeenCalledWith('id', '1');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockImageData);
      expect(Logger.info).toHaveBeenCalledWith(
        'ImageController.getById',
        `Successfully fetched image with id: 1`
      );
    });

    it('should return 404 when image is not found', async () => {
      mockRequest.params = { id: '999' };
      mockKnexInstance.first.mockResolvedValue(null);

      await ImageController.getById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Image not found' });
      expect(Logger.warn).toHaveBeenCalledWith(
        'ImageController.getById',
        `Image not found with id: 999`
      );
    });

    it('should handle errors appropriately', async () => {
      mockRequest.params = { id: '1' };
      const mockError = new Error('Database error');
      mockKnexInstance.first.mockRejectedValue(mockError);

      await ImageController.getById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
      expect(Logger.error).toHaveBeenCalledWith(
        'ImageController.getById',
        `Failed to fetch image with id: 1`,
        mockError
      );
    });
  });
});
