import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISectionService } from '../ports/inbound/section.service.interface';
import {
  CreateSectionDto,
  UpdateSectionDto,
} from '../../../infraestructure/api-rest/dtos/section.dto';
import { Section } from '../models/section.model';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionEntity } from '../../../infraestructure/postgres/entities/section.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class SectionService implements ISectionService {
  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
  ) {}

  async findAllSections(): Promise<Section[]> {
    const sections = await this.sectionRepository.find();
    return sections;
  }

  async findSectionById(id: string): Promise<Section> {
    const section = await this.sectionRepository.findOne({ where: { id: id } });
    if (!section) {
      throw new NotFoundException('Section Not Found');
    }
    return section;
  }

  async createSection(createSectionDto: CreateSectionDto): Promise<Section> {
    try {
      const section = this.sectionRepository.create(createSectionDto);
      await this.sectionRepository.save(section);
      return section;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Section with this name already exists');
      }
    }
  }

  async updateSection(
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const updateResult = await this.sectionRepository.update(
      id,
      updateSectionDto,
    );
    if (updateResult.affected === 0) {
      throw new NotFoundException('Section not found');
    }
    const updateSection = await this.sectionRepository.findOne({
      where: { id: id },
    });
    if (!updateSection) {
      throw new NotFoundException('Error retrieving updated section');
    }
    return updateSection;
  }

  async deleteSection(id: string) {
    const section = await this.sectionRepository.findOne({ where: { id: id } });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    await this.sectionRepository.delete(id);
    return { message: `Section with id ${id} was deleted.` };
  }
}
