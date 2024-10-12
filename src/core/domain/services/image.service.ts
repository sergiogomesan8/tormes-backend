import { Injectable } from '@nestjs/common';
import { IImageService } from '../ports/inbound/image.service.interface';
import { FileInterceptorSavePath } from '../../../infraestructure/api-rest/models/file-interceptor.model';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  constructor(private readonly imageService: IImageService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (process.env.NODE_ENV !== 'production') {
      return file.filename;
    }
    return await this.imageService.uploadImage(file);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${imageUrl}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await this.imageService.deleteImage(imageUrl);
  }
}
