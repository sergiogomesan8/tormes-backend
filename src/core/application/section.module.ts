import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from '../../infraestructure/postgres/entities/section.entity';
import { SectionController } from '../../infraestructure/api-rest/controllers/section.controller';
import { SectionService } from '../domain/services/section.service';
import { ImageModule } from './image.module';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity]), ImageModule],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
