import { AstronautEntity } from '../Astronaut.entity';

describe('AstronautEntity', () => {
  const mockPlanetResponse = {
    id: 1,
    name: 'Earth',
    description: 'Home planet',
    isHabitable: true,
    image: {
      path: '/images/earth.jpg',
      name: 'earth.jpg'
    }
  };

  const mockDatabaseData = {
    id: 1,
    firstname: 'Neil',
    lastname: 'Armstrong',
    originPlanetId: 1
  };

  describe('fromDatabase', () => {
    it('should create an AstronautEntity instance from database data', () => {
      const astronaut = AstronautEntity.fromDatabase(mockDatabaseData);

      expect(astronaut).toBeInstanceOf(AstronautEntity);
      expect(astronaut.id).toBe(mockDatabaseData.id);
      expect(astronaut.firstname).toBe(mockDatabaseData.firstname);
      expect(astronaut.lastname).toBe(mockDatabaseData.lastname);
      expect(astronaut.originPlanetId).toBe(mockDatabaseData.originPlanetId);
    });
  });
});
