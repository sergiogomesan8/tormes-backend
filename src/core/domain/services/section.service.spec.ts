import { Test, TestingModule } from '@nestjs/testing';
import { SectionService } from './section.service';
import { QueryFailedError, Repository } from 'typeorm';
import { SectionEntity } from '../../../infraestructure/postgres/entities/section.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Section } from '../models/section.model';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  CreateSectionDto,
  UpdateSectionDto,
} from '../../../infraestructure/api-rest/dtos/section.dto';

describe('SectionService', () => {
  let sectionService: SectionService;
  let sectionRepository: Repository<SectionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionService,
        {
          provide: getRepositoryToken(SectionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    sectionService = module.get<SectionService>(SectionService);
    sectionRepository = module.get<Repository<SectionEntity>>(
      getRepositoryToken(SectionEntity),
    );
  });

  const name = 'Section name';
  const image = 'https://example.com/image.jpg';

  const section: Section = {
    id: expect.any(String),
    name,
    image,
  };

  const createSectionDto = new CreateSectionDto(name, image);

  const updateSectionDto = new UpdateSectionDto(name, image);

  describe('findAllSections', () => {
    it('should return all sections', async () => {
      jest.spyOn(sectionRepository, 'find').mockResolvedValue([section]);

      const sections = await sectionService.findAllSections();
      expect(sections).toEqual([section]);
      expect(sectionRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no sections are found', async () => {
      jest.spyOn(sectionRepository, 'find').mockResolvedValue([]);

      const sections = await sectionService.findAllSections();
      expect(sections).toEqual([]);
      expect(sectionRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(sectionRepository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(sectionService.findAllSections()).rejects.toThrow(
        'Database error',
      );
      expect(sectionRepository.find).toHaveBeenCalled();
    });
  });

  describe('findSectionById', () => {
    it('should return section with the id', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(section);

      const sectionResult = await sectionService.findSectionById(
        expect.any(String),
      );
      expect(sectionResult).toEqual(section);
      expect(sectionRepository.findOne).toHaveBeenCalled();
    });

    it('should return NotFoundException when sections does not exists', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        sectionService.findSectionById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
      expect(sectionRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        sectionService.findSectionById(expect.any(String)),
      ).rejects.toThrow('Database error');
      expect(sectionRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error when it happens', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockRejectedValue(new Error());

      await expect(
        sectionService.findSectionById(expect.any(String)),
      ).rejects.toThrow(Error);
      expect(sectionRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('createSection', () => {
    it('should create a section', async () => {
      jest
        .spyOn(sectionRepository, 'create')
        .mockImplementation(() => section as any);
      jest
        .spyOn(sectionRepository, 'save')
        .mockImplementation(() => Promise.resolve(section as any));

      expect(await sectionService.createSection(createSectionDto)).toEqual(
        section,
      );
      expect(sectionRepository.create).toHaveBeenCalledWith(createSectionDto);
      expect(sectionRepository.save).toHaveBeenCalledWith(section);
    });

    it('should throw ConflictException when section name already exists', async () => {
      jest
        .spyOn(sectionRepository, 'create')
        .mockImplementation(() => section as any);
      jest.spyOn(sectionRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query', [], new Error());
      });

      try {
        await sectionService.createSection(createSectionDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Section with this name already exists');
      }
      expect(sectionRepository.create).toHaveBeenCalledWith(createSectionDto);
      expect(sectionRepository.save).toHaveBeenCalledWith(section);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(sectionRepository, 'create').mockImplementation(() => {
        throw new Error('Create error');
      });

      try {
        await sectionService.createSection(createSectionDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Create error');
      }
    });

    it('should throw an error if save fails', async () => {
      jest
        .spyOn(sectionRepository, 'create')
        .mockImplementation(() => section as any);
      jest.spyOn(sectionRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await sectionService.createSection(createSectionDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
    });
  });
  describe('updateSection', () => {
    it('should update a section', async () => {
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as any);

      const result = await sectionService.updateSection('id', updateSectionDto);
      expect(result).toEqual(section);
      expect(sectionRepository.update).toHaveBeenCalledWith(
        'id',
        updateSectionDto,
      );
      expect(sectionRepository.findOne).toHaveBeenCalled();
    });

    it('should throw a NotFoundException when no section is found to update', async () => {
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        sectionService.updateSection('id', updateSectionDto),
      ).rejects.toThrow(new NotFoundException('Section not found'));
    });

    it('should throw a NotFoundException when the updated section cannot be found', async () => {
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        sectionService.updateSection('id', updateSectionDto),
      ).rejects.toThrow(
        new NotFoundException('Error retrieving updated section'),
      );
    });

    it('should throw an error on update method when it happens', async () => {
      jest.spyOn(sectionRepository, 'update').mockRejectedValue(new Error());
      await expect(
        sectionService.updateSection('id', updateSectionDto),
      ).rejects.toThrow(Error);
      expect(sectionRepository.update).toHaveBeenCalled();
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(sectionRepository, 'findOne').mockRejectedValue(new Error());
      await expect(
        sectionService.updateSection('id', updateSectionDto),
      ).rejects.toThrow(Error);
      expect(sectionRepository.update).toHaveBeenCalled();
      expect(sectionRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('deleteSection', () => {
    it('should delete a section when section exists', async () => {
      const sectionId = 'section-id';
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(section);
      jest
        .spyOn(sectionRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await sectionService.deleteSection(sectionId);
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: sectionId },
      });
      expect(sectionRepository.delete).toHaveBeenCalledWith(sectionId);
      expect(result).toEqual({
        message: `Section with id ${sectionId} was deleted.`,
      });
    });

    it('should throw NotFoundException when section does not exist', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(undefined);
      await expect(sectionService.deleteSection('section-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockRejectedValue(new Error());
      await expect(sectionService.deleteSection('section-id')).rejects.toThrow(
        Error,
      );
      expect(sectionRepository.findOne).toHaveBeenCalled();
    });

    it('should throw error when delete method throws an error', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(section);
      jest.spyOn(sectionRepository, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await expect(sectionService.deleteSection('section-id')).rejects.toThrow(
        'Error',
      );
    });
  });
});
