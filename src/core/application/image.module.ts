import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../../infraestructure/cloudinary/cloudinary.module';
import { ImageService } from '../domain/services/image.service';

@Module({
  imports: [CloudinaryModule],
  providers: [
    {
      provide: 'IImageService',
      useClass: ImageService,
    },
  ],
  exports: ['IImageService'],
})
export class ImageModule {}
