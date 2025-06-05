import { PlanetEntity } from '../Planet.entity';

describe('PlanetEntity', () => {
  const mockImageResponse = {
    id: 1,
    name: 'earth.jpg',
    path: '/images/earth.jpg'
  };

  const mockDatabaseData = {
    id: 1,
    name: 'Earth',
    description: 'Home planet',
    isHabitable: true,
    imageId: 1
  };

  describe('fromDatabase', () => {
    it('should create a PlanetEntity instance from database data', () => {
      const planet = PlanetEntity.fromDatabase(mockDatabaseData);

      expect(planet).toBeInstanceOf(PlanetEntity);
      expect(planet.id).toBe(mockDatabaseData.id);
      expect(planet.name).toBe(mockDatabaseData.name);
      expect(planet.description).toBe(mockDatabaseData.description);
      expect(planet.isHabitable).toBe(mockDatabaseData.isHabitable);
      expect(planet.imageId).toBe(mockDatabaseData.imageId);
    });
  });

  describe('toResponse', () => {
    it('should convert entity to response format with image data', () => {
      const planet = PlanetEntity.fromDatabase(mockDatabaseData);
      const response = planet.toResponse(mockImageResponse);

      expect(response).toEqual({
        id: mockDatabaseData.id,
        name: mockDatabaseData.name,
        description: mockDatabaseData.description,
        isHabitable: mockDatabaseData.isHabitable,
        image: {
          path: mockImageResponse.path,
          name: mockImageResponse.name
        }
      });
    });
  });
});
