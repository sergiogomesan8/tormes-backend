import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISectionService } from '../ports/inbound/section.service.interface';
import {
  CreateSectionDto,
  UpdateSectionDto,
} from '../../../infraestructure/api-rest/dtos/section.dto';
import { Section } from '../models/section.model';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionEntity } from '../../../infraestructure/postgres/entities/section.entity';
import { Repository } from 'typeorm';
import { IImageService } from '../ports/inbound/image.service.interface';

@Injectable()
export class SectionService implements ISectionService {
  private readonly logger = new Logger(SectionService.name);

  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
    @Inject('IImageService')
    private readonly imageService: IImageService,
  ) {}

  async findAllSections(): Promise<Section[]> {
    const sections = await this.sectionRepository.find();
    if (!sections) {
      this.logger.error('Sections not found');
    }
    return sections;
  }

  async findSectionById(id: string): Promise<Section> {
    const section = await this.sectionRepository.findOne({
      where: { id: id },
    });
    if (!section) {
      this.logger.error(`Section with ${id} not found`);
    }
    return section;
  }

  async createSection(
    createSectionDto: CreateSectionDto,
    file: Express.Multer.File,
  ): Promise<Section> {
    try {
      const image = await this.imageService.uploadImage(file);
      const section = this.sectionRepository.create({
        ...createSectionDto,
        image,
      });
      await this.sectionRepository.save(section);
      return section;
    } catch (error) {
      this.logger.error(
        `Error creating section: ${error.message}`,
        error.stack,
      );
    }
  }

  async updateSection(
    id: string,
    updateSectionDto: UpdateSectionDto,
    file: Express.Multer.File | null,
  ): Promise<Section> {
    try {
      const existingSection = await this.sectionRepository.findOne({
        where: { id: id },
      });
      let image: string;
      if (file) {
        await this.imageService.deleteImage(existingSection.image);
        image = await this.imageService.uploadImage(file);
      } else {
        image = existingSection.image;
      }

      await this.sectionRepository.update(id, { ...updateSectionDto, image });

      const updateSection = await this.sectionRepository.findOne({
        where: { id: id },
      });
      return updateSection;
    } catch (error) {
      this.logger.error(
        `Error updating section: ${error.message}`,
        error.stack,
      );
    }
  }

  async deleteSection(id: string) {
    const section = await this.sectionRepository.findOne({ where: { id: id } });

    if (section) {
      await this.imageService.deleteImage(section.image);
      await this.sectionRepository.delete(id);
      return { message: `Section with id ${id} was deleted.` };
    } else {
      this.logger.error(`Section with ${id} not found`);
    }
  }
}
