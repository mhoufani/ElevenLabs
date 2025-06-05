import { Request, Response } from 'express';
import PlanetController from '../Planet.controller';
import knex from '../../db';
import Logger from '../../utils/logger';
import { Knex } from 'knex';

// Mock the database
jest.mock('../../db', () => {
  return jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    join: jest.fn().mockReturnThis(),
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

describe('PlanetController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockKnexInstance: {
    select: jest.Mock;
    where: jest.Mock;
    join: jest.Mock;
    then: jest.Mock;
  };

  const mockImageResponse = {
    path: '/images/earth.jpg',
    name: 'earth.jpg'
  };

  const mockPlanetData = {
    id: 1,
    name: 'Earth',
    description: 'Blue planet',
    isHabitable: true,
    imageId: 1,
    path: '/images/earth.jpg',
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
    // Reset knex mock for each test
    jest.clearAllMocks();
    mockKnexInstance = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      join: jest.fn().mockReturnThis(),
      then: jest.fn()
    };
    (jest.mocked(knex) as unknown as jest.Mock).mockReturnValue(mockKnexInstance);
  });

  describe('getAll', () => {
    it('should return all planets when no filter is provided', async () => {
      const mockPlanets = [mockPlanetData];
      mockKnexInstance.then.mockImplementation((callback: Function) => Promise.resolve(callback(mockPlanets)));

      await PlanetController.getAll(mockRequest as Request, mockResponse as Response);

      expect(knex).toHaveBeenCalledWith('planets');
      expect(mockKnexInstance.select).toHaveBeenCalledWith(
        'planets.*',
        'images.path',
        'images.name as imageName'
      );
      expect(mockKnexInstance.join).toHaveBeenCalledWith(
        'images',
        'images.id',
        '=',
        'planets.imageId'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      const expectedResponse = [{
        id: mockPlanetData.id,
        name: mockPlanetData.name,
        description: mockPlanetData.description,
        isHabitable: mockPlanetData.isHabitable,
        image: mockImageResponse
      }];
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
      expect(Logger.info).toHaveBeenCalledWith(
        'PlanetController.getAll',
        expect.stringContaining('Successfully fetched')
      );
    });

    it('should apply name filter when filterName is provided', async () => {
      mockRequest.query = { filterName: 'Earth' };
      const mockPlanets = [mockPlanetData];
      mockKnexInstance.then.mockImplementation((callback: Function) => Promise.resolve(callback(mockPlanets)));

      await PlanetController.getAll(mockRequest as Request, mockResponse as Response);

      expect(knex).toHaveBeenCalledWith('planets');
      expect(mockKnexInstance.where).toHaveBeenCalledWith(
        'planets.name',
        'like',
        '%Earth%'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      const expectedResponse = [{
        id: mockPlanetData.id,
        name: mockPlanetData.name,
        description: mockPlanetData.description,
        isHabitable: mockPlanetData.isHabitable,
        image: mockImageResponse
      }];
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
      expect(Logger.info).toHaveBeenCalledWith(
        'PlanetController.getAll',
        expect.stringContaining('Applying name filter')
      );
    });

    it('should handle errors appropriately', async () => {
      const mockError = { message: 'Database error' };
      (jest.mocked(knex) as unknown as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      await PlanetController.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
      expect(Logger.error).toHaveBeenCalledWith(
        'PlanetController.getAll',
        'Failed to fetch planets',
        mockError
      );
    });
  });
}); 