import { Injectable } from '@nestjs/common';
import { IImageService } from '../ports/inbound/image.service.interface';

@Injectable()
export class ImageService {
    constructor(private readonly imageService: IImageService) {}

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return await this.imageService.uploadImage(file);
    }

    async deleteImage(imageUrl: string): Promise<void> {
        await this.imageService.deleteImage(imageUrl);
    }
}