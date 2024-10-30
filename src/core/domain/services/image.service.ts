import { Injectable, Logger } from '@nestjs/common';
import { IImageService } from '../ports/inbound/image.service.interface';
import { FileInterceptorSavePath } from '../../../infraestructure/api-rest/models/file-interceptor.model';
import * as fs from 'fs';
import { CloudinaryService } from '../../../infraestructure/cloudinary/cloudinary.service';

@Injectable()
export class ImageService implements IImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (process.env.NODE_ENV !== 'production') {
      return file.filename;
    }
    return await this.cloudinaryService.uploadImage(file);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${imageUrl}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await this.cloudinaryService.deleteImage(imageUrl);
  }
}
