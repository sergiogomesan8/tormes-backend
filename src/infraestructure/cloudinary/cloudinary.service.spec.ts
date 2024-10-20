import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ResponseCallback,
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadResponseCallback,
  v2,
} from 'cloudinary';
import { HttpStatus } from '@nestjs/common';
import { CloudinaryError } from './exceptions/cloudinary.errors';
import * as streamifier from 'streamifier';

jest.mock('@nestjs/config');
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService, ConfigService],
    }).compile();

    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  describe('uploadImage', () => {
    it('should upload an image to Cloudinary', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('mocked-image-data'),
        fieldname: 'file',
        originalname: 'mocked-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
      } as Express.Multer.File;

      const mockUploadApiResponse: UploadApiResponse = {
        public_id: 'mocked-public-id',
        secure_url: 'https://mocked-url',
        version: 1,
        width: 300,
        height: 200,
      } as UploadApiResponse;

      (v2.uploader.upload_stream as jest.Mock).mockImplementation(
        (callback: UploadResponseCallback) => {
          callback(null, mockUploadApiResponse);
        },
      );

      const result = await cloudinaryService.uploadImage(mockFile);

      expect(result).toEqual(mockUploadApiResponse.secure_url);
    });

    it('should handle upload failure', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('mocked-image-data'),
        fieldname: 'file',
        originalname: 'mocked-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
      } as Express.Multer.File;

      const mockError: UploadApiErrorResponse = {
        http_code: 500,
        message: 'Upload failed',
      } as UploadApiErrorResponse;

      (v2.uploader.upload_stream as jest.Mock).mockImplementation(
        (callback: UploadResponseCallback) => {
          callback(mockError, null);
        },
      );

      const loggerSpy = jest.spyOn(cloudinaryService['logger'], 'error');

      await expect(
        cloudinaryService.uploadImage(mockFile),
      ).rejects.toThrowError(
        new CloudinaryError(
          mockError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error uploading image to Cloudinary: ${mockError.message}`,
        expect.anything(),
      );
    });
  });

  describe('deleteImage', () => {
    it('should delete an image from Cloudinary', async () => {
      const mockPublicId = 'mocked-public-id';

      (v2.uploader.destroy as jest.Mock).mockImplementation(
        (publicId: string, callback: ResponseCallback) => {
          callback(null, undefined);
        },
      );

      const result = await cloudinaryService.deleteImage(mockPublicId);

      expect(result).toBeUndefined();
    });

    it('should handle delete failure', async () => {
      const mockPublicId = 'mocked-public-id';

      const mockError: UploadApiErrorResponse = {
        http_code: 500,
        message: 'Delete failed',
      } as UploadApiErrorResponse;

      (v2.uploader.destroy as jest.Mock).mockImplementation(
        (publicId: string, callback: ResponseCallback) => {
          callback(mockError, null);
        },
      );

      const loggerSpy = jest.spyOn(cloudinaryService['logger'], 'error');

      await expect(
        cloudinaryService.deleteImage(mockPublicId),
      ).rejects.toThrowError(
        new CloudinaryError(
          mockError.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        `Error deleting the image: ${mockError.message}`,
        expect.anything(),
      );
    });
  });
});
