import { IImageService } from '../inbound/image.service.interface';

export abstract class AbstractImageService implements IImageService {
  abstract uploadImage(file: Express.Multer.File): Promise<string>;
  abstract deleteImage(imageUrl: string): Promise<void>;
}
