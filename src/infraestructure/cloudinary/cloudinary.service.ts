import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { AbstractImageService } from '../../core/domain/ports/outbound/abstract-image.service.interface';
import { CloudinaryError } from '../cloudinary/exceptions/cloudinary.errors';

@Injectable()
export class CloudinaryService extends AbstractImageService {
  private readonly logger = new Logger(CloudinaryService.name);

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            reject(new Error(error.message));
          } else {
            resolve(result);
          }
        });
        streamifier.createReadStream(file.buffer).pipe(upload);
      });

      return result.secure_url;
    } catch (error) {
      this.logger.error(
        `Error uploading image to Cloudinary: ${error.message}`,
        error.stack,
      );
      throw new CloudinaryError(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            reject(new Error(error.message));
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      this.logger.error(
        `Error deleting the image: ${error.message}`,
        error.stack,
      );
      throw new CloudinaryError(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
