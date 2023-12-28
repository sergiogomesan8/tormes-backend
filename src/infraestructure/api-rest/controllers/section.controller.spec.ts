import { Test, TestingModule } from '@nestjs/testing';
import { SectionController } from './section.controller';
import { SectionService } from '../../../core/domain/services/section.service';
import { Section } from '../../../core/domain/models/section.model';
import { CreateSectionDto, UpdateSectionDto } from '../dtos/section.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('SectionController', () => {
  let sectionController: SectionController;
  let sectionService: SectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionController],
      providers: [
        {
          provide: SectionService,
          useValue: {
            findAllSections: jest.fn(),
            findSectionById: jest.fn(),
            createSection: jest.fn(),
            updateSection: jest.fn(),
            deleteSection: jest.fn(),
          },
        },
      ],
    }).compile();

    sectionController = module.get<SectionController>(SectionController);
    sectionService = module.get<SectionService>(SectionService);
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
    it('should return an array of sections', async () => {
      jest
        .spyOn(sectionService, 'findAllSections')
        .mockResolvedValue([section]);
      expect(await sectionController.findAllSections()).toEqual([section]);
      expect(sectionService.findAllSections).toHaveBeenCalled();
    });

    it('should return an empty array if no sections are found', async () => {
      jest.spyOn(sectionService, 'findAllSections').mockResolvedValue([]);
      expect(await sectionController.findAllSections()).toEqual([]);
      expect(sectionService.findAllSections).toHaveBeenCalled();
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(sectionService, 'findAllSections')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(sectionController.findAllSections()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findSectionById', () => {
    it('should return a section by id', async () => {
      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
      expect(await sectionController.findSectionById(expect.any(String))).toBe(
        section,
      );
      expect(sectionService.findSectionById).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should return a NotFoundException if section was not found', () => {
      jest
        .spyOn(sectionService, 'findSectionById')
        .mockRejectedValue(new NotFoundException());

      return expect(
        sectionController.findSectionById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(sectionService, 'findSectionById')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.findSectionById(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createSection', () => {
    it('should create a section', async () => {
      jest.spyOn(sectionService, 'createSection').mockResolvedValue(section);

      jest.spyOn(sectionService, 'createSection').mockResolvedValue(section);
      expect(await sectionController.createSection(createSectionDto)).toBe(
        section,
      );
      expect(sectionService.createSection).toHaveBeenCalledWith(
        createSectionDto,
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(sectionService, 'findSectionById')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.findSectionById(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateSection', () => {
    it('should update a section', async () => {
      jest.spyOn(sectionService, 'updateSection').mockResolvedValue(section);

      expect(
        await sectionController.updateSection(
          expect.any(String),
          updateSectionDto,
        ),
      ).toBe(section);
      expect(sectionService.updateSection).toHaveBeenCalledWith(
        expect.any(String),
        updateSectionDto,
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(sectionService, 'updateSection')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.updateSection(expect.any(String), updateSectionDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteSection', () => {
    it('should delete a section', async () => {
      jest.spyOn(sectionService, 'deleteSection').mockResolvedValue({
        message: `Section with id ${expect.any(String)} was deleted.`,
      });

      expect(await sectionController.deleteSection(expect.any(String))).toEqual(
        {
          message: `Section with id ${expect.any(String)} was deleted.`,
        },
      );
      expect(sectionService.deleteSection).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(sectionService, 'deleteSection')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.deleteSection(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
