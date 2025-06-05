import { Request, Response } from 'express';
import AstronautController from '../../controllers/Astronaut.controller';
import knex from '../../db';
import Logger from '../../utils/logger';

// Mock the database
jest.mock('../../db', () => {
  return jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    join: jest.fn().mockReturnThis(),
    first: jest.fn(),
    then: jest.fn()
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

describe('AstronautController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockKnexInstance: {
    select: jest.Mock;
    where: jest.Mock;
    join: jest.Mock;
    first: jest.Mock;
    then: jest.Mock;
  };

  const mockImageData = {
    id: 1,
    path: '/images/earth.jpg',
    name: 'earth.jpg'
  };

  const mockPlanetData = {
    id: 1,
    name: 'Earth',
    description: 'Blue planet',
    isHabitable: true,
    imageId: 1
  };

  const mockAstronautData = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    originPlanetId: 1,
    planetId: 1,
    planetName: 'Earth',
    planetDescription: 'Blue planet',
    isHabitable: true,
    imagePath: '/images/earth.jpg',
    imageName: 'earth.jpg'
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
    // Reset all mocks
    jest.clearAllMocks();
    mockKnexInstance = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      then: jest.fn()
    };
    (jest.mocked(knex) as unknown as jest.Mock).mockReturnValue(mockKnexInstance);
  });

  describe('getById', () => {
    it('should return an astronaut when valid ID is provided', async () => {
      mockRequest.params = { id: '1' };
      mockKnexInstance.first.mockResolvedValue(mockAstronautData);

      await AstronautController.getById(mockRequest as Request, mockResponse as Response);

      expect(knex).toHaveBeenCalledWith('astronauts');
      expect(mockKnexInstance.where).toHaveBeenCalledWith('astronauts.id', '1');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        id: mockAstronautData.id,
        firstname: mockAstronautData.firstname,
        lastname: mockAstronautData.lastname,
        originPlanet: {
          id: mockAstronautData.planetId,
          name: mockAstronautData.planetName,
          description: mockAstronautData.planetDescription,
          isHabitable: mockAstronautData.isHabitable,
          image: {
            path: mockAstronautData.imagePath,
            name: mockAstronautData.imageName
          }
        }
      });
      expect(Logger.info).toHaveBeenCalledWith(
        'AstronautController.getById',
        `Successfully fetched astronaut with id: 1`
      );
    });

    it('should return 404 when astronaut is not found', async () => {
      mockRequest.params = { id: '999' };
      mockKnexInstance.first.mockResolvedValue(null);

      await AstronautController.getById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Astronaut not found' });
      expect(Logger.warn).toHaveBeenCalledWith(
        'AstronautController.getById',
        `Astronaut not found with id: 999`
      );
    });

    it('should handle errors appropriately', async () => {
      mockRequest.params = { id: '1' };
      const mockError = new Error('Database error');
      mockKnexInstance.first.mockRejectedValue(mockError);

      await AstronautController.getById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
      expect(Logger.error).toHaveBeenCalledWith(
        'AstronautController.getById',
        `Failed to fetch astronaut with id: 1`,
        mockError
      );
    });
  });
});
