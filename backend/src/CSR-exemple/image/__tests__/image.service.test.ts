import { ImageService } from '../application/image.service';
import { IImageRepository } from '../domain/image.repository';
import { IImageEntity } from '../domain/image.entity';

describe('ImageService', () => {
    let imageService: ImageService;
    let mockImageRepository: jest.Mocked<IImageRepository>;

    const mockImage: IImageEntity = {
        id: 1,
        name: 'test.jpg',
        path: '/images/test.jpg'
    };

    beforeEach(() => {
        mockImageRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        imageService = new ImageService(mockImageRepository);
    });

    describe('getImages', () => {
        it('should return all images', async () => {
            mockImageRepository.findAll.mockResolvedValue([mockImage]);

            const result = await imageService.getImages();

            expect(result).toEqual([mockImage]);
            expect(mockImageRepository.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no images exist', async () => {
            mockImageRepository.findAll.mockResolvedValue([]);

            const result = await imageService.getImages();

            expect(result).toEqual([]);
            expect(mockImageRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('getImageById', () => {
        it('should return an image when found', async () => {
            mockImageRepository.findById.mockResolvedValue(mockImage);

            const result = await imageService.getImageById(1);

            expect(result).toEqual(mockImage);
            expect(mockImageRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return null when image is not found', async () => {
            mockImageRepository.findById.mockResolvedValue(null);

            const result = await imageService.getImageById(999);

            expect(result).toBeNull();
            expect(mockImageRepository.findById).toHaveBeenCalledWith(999);
        });
    });

    describe('createImage', () => {
        const newImage: Omit<IImageEntity, 'id'> = {
            name: 'new.jpg',
            path: '/images/new.jpg'
        };

        it('should create and return a new image', async () => {
            const createdImage: IImageEntity = { ...newImage, id: 2 };
            mockImageRepository.create.mockResolvedValue(createdImage);

            const result = await imageService.createImage(newImage);

            expect(result).toEqual(createdImage);
            expect(mockImageRepository.create).toHaveBeenCalledWith(newImage);
        });

        it('should return null when creation fails', async () => {
            mockImageRepository.create.mockResolvedValue(null);

            const result = await imageService.createImage(newImage);

            expect(result).toBeNull();
            expect(mockImageRepository.create).toHaveBeenCalledWith(newImage);
        });
    });

    describe('updateImage', () => {
        const updatedImage: IImageEntity = {
            id: 1,
            name: 'updated.jpg',
            path: '/images/updated.jpg'
        };

        it('should update and return the image', async () => {
            mockImageRepository.update.mockResolvedValue(updatedImage);

            const result = await imageService.updateImage(updatedImage);

            expect(result).toEqual(updatedImage);
            expect(mockImageRepository.update).toHaveBeenCalledWith(updatedImage);
        });

        it('should return null when image is not found', async () => {
            mockImageRepository.update.mockResolvedValue(null);

            const result = await imageService.updateImage(updatedImage);

            expect(result).toBeNull();
            expect(mockImageRepository.update).toHaveBeenCalledWith(updatedImage);
        });
    });

    describe('deleteImage', () => {
        it('should return true when image is successfully deleted', async () => {
            mockImageRepository.delete.mockResolvedValue(true);

            const result = await imageService.deleteImage(1);

            expect(result).toBe(true);
            expect(mockImageRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should return false when image is not found', async () => {
            mockImageRepository.delete.mockResolvedValue(false);

            const result = await imageService.deleteImage(999);

            expect(result).toBe(false);
            expect(mockImageRepository.delete).toHaveBeenCalledWith(999);
        });
    });
}); 