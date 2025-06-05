import { ImageEntity } from '../Image.entity';

describe('ImageEntity', () => {
  const mockDatabaseData = {
    id: 1,
    name: 'earth.jpg',
    path: '/images/earth.jpg'
  };

  describe('fromDatabase', () => {
    it('should create an ImageEntity instance from database data', () => {
      const image = ImageEntity.fromDatabase(mockDatabaseData);

      expect(image).toBeInstanceOf(ImageEntity);
      expect(image.id).toBe(mockDatabaseData.id);
      expect(image.name).toBe(mockDatabaseData.name);
      expect(image.path).toBe(mockDatabaseData.path);
    });
  });

  describe('toResponse', () => {
    it('should convert entity to response format', () => {
      const image = ImageEntity.fromDatabase(mockDatabaseData);
      const response = image.toResponse();

      expect(response).toEqual({
        id: mockDatabaseData.id,
        name: mockDatabaseData.name,
        path: mockDatabaseData.path
      });
    });
  });
});
