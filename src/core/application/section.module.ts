import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from '../../infraestructure/postgres/entities/section.entity';
import { SectionController } from '../../infraestructure/api-rest/controllers/section.controller';
import { SectionService } from '../domain/services/section.service';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity])],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
