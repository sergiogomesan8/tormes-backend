import {
  CreateSectionDto,
  UpdateSectionDto,
} from '../../../../infraestructure/api-rest/dtos/section.dto';
import { Section } from '../../models/section.model';

export interface ISectionService {
  findAllSections(): Promise<Section[]>;
  findSectionById(id: string): Promise<Section | null>;
  createSection(createSectionDto: CreateSectionDto): Promise<Section>;
  updateSection(
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section | null>;
  deleteSection(id: string);
}
