import { Module } from '@nestjs/common';
import { CloudinaryService } from 'src/infraestructure/cloudinary/cloudinary.service';
import { CloudinaryModule } from '../../infraestructure/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [
    {
      provide: 'IImageService',
      useClass: CloudinaryService,
    },
  ],
  exports: ['IImageService'],
})
export class ImageModule {}
