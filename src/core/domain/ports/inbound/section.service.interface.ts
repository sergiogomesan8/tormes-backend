import {
  CreateSectionDto,
  UpdateSectionDto,
} from '../../../../infraestructure/api-rest/dtos/section.dto';
import { Section } from '../../models/section.model';

export interface ISectionService {
  findAllSections(): Promise<Section[]>;
  findSectionById(id: string): Promise<Section | null>;
  createSection(
    createSectionDto: CreateSectionDto,
    file: Express.Multer.File,
  ): Promise<Section>;
  updateSection(
    id: string,
    updateSectionDto: UpdateSectionDto,
    file: Express.Multer.File | null,
  ): Promise<Section | null>;
  deleteSection(id: string);
}
