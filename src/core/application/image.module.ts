import { Module } from '@nestjs/common';
import { CloudinaryService } from 'src/infraestructure/cloudinary-config/cloudinary.service';
import { ImageService } from '../domain/services/image.service';
import { CloudinaryModule } from '../../infraestructure/cloudinary-config/cloudinary.module';

@Module({
    imports: [CloudinaryModule],
    providers: [
        {
            provide: 'IImageService',
            useClass: CloudinaryService
        },
    ],
    exports: ['IImageService'],
})
export class ImageModule {}
