import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import * as fs from 'fs';
import { FileInterceptorSavePath } from '../../../infraestructure/api-rest/models/file-interceptor.model';
import { CloudinaryService } from '../../../infraestructure/cloudinary/cloudinary.service';

describe('ImageService', () => {
  let imageService: ImageService;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
          },
        },
      ],
    }).compile();

    imageService = module.get<ImageService>(ImageService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  const file: Express.Multer.File = {
    fieldname: 'image',
    originalname: 'producto.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('contenido_simulado_de_imagen'),
    size: 1024,
    filename: 'producto.jpg',
  } as Express.Multer.File;

  const image = 'https://example.com/image.jpg';

  describe('uploadImage', () => {
    it('should upload image to cloudinary if in production', async () => {
      process.env.NODE_ENV = 'production';
      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue(image);
      const result = await imageService.uploadImage(file);

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(
        file,
      );
      expect(result).toBe(image);
    });

    it('should return the filename if in development', async () => {
      process.env.NODE_ENV = 'development';
      const result = await imageService.uploadImage(file);
      expect(result).toBe(file.filename);
    });

    it('should throw an error if image upload fails', async () => {
      process.env.NODE_ENV = 'production';
      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockRejectedValue(new Error('Failed to upload image'));
      await expect(imageService.uploadImage(file)).rejects.toThrow(
        'Failed to upload image',
      );
    });
  });

  describe('deleteImage', () => {
    it('should delete image from cloudinary if in production', async () => {
      process.env.NODE_ENV = 'production';
      jest.spyOn(cloudinaryService, 'deleteImage').mockResolvedValue();
      await imageService.deleteImage(image);
      expect(cloudinaryService.deleteImage).toHaveBeenCalledWith(image);
    });

    it('should delete image from local file system if in development', async () => {
      process.env.NODE_ENV = 'development';
      const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${image}`;
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

      await imageService.deleteImage(image);
      expect(fs.existsSync).toHaveBeenCalledWith(imagePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(imagePath);
    });

    it('should throw an error if image deletion fails', async () => {
      process.env.NODE_ENV = 'production';
      jest
        .spyOn(cloudinaryService, 'deleteImage')
        .mockRejectedValue(new Error('Failed to delete image'));
      await expect(imageService.deleteImage(image)).rejects.toThrow(
        'Failed to delete image',
      );
    });
  });
});
