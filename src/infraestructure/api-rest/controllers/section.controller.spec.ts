import { Test, TestingModule } from '@nestjs/testing';
import { SectionController } from './section.controller';
import { SectionService } from '../../../core/domain/services/section.service';
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
  const image = { filename: 'test.jpg' } as Express.Multer.File;

  const section = {
    id: expect.any(String),
    name,
    image: image.filename,
  };

  const createSectionDto = new CreateSectionDto(name);

  const updateSectionDto = new UpdateSectionDto(name);

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

    it('should log an error and return a NotFoundException if section was not found', () => {
      const loggerSpy = jest.spyOn(sectionController['logger'], 'error');
      jest
        .spyOn(sectionService, 'findSectionById')
        .mockResolvedValue(null);

      return expect(
        sectionController.findSectionById(expect.any(String)),
      ).rejects.toThrow(NotFoundException).finally(() => {
        expect(loggerSpy).toHaveBeenCalledWith(`Section with ${expect.any(String)} not found`);
      });
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
    it('should create a section if file is provided', async () => {
      jest.spyOn(sectionService, 'createSection').mockResolvedValue(section);

      expect(
        await sectionController.createSection(image, createSectionDto),
      ).toStrictEqual(section);
      expect(sectionService.createSection).toHaveBeenCalledWith(
        createSectionDto,
        image,
      );
    });

    it('should throw an error if no file is provided', () => {
      return expect(
        sectionController.createSection(null, createSectionDto),
      ).rejects.toThrow('No file provided');
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(sectionService, 'createSection')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.createSection(image, createSectionDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateSection', () => {
    it('should update a section if file is provided', async () => {
      jest.spyOn(sectionService, 'updateSection').mockResolvedValue(section);

      expect(
        await sectionController.updateSection(
          image,
          expect.any(String),
          updateSectionDto,
        ),
      ).toStrictEqual(section);
      expect(sectionService.updateSection).toHaveBeenCalledWith(
        expect.any(String),
        updateSectionDto,
        image
      );
    });

    it('should update a section without file provided', async () => {
      jest.spyOn(sectionService, 'updateSection').mockResolvedValue(section);

      expect(
        await sectionController.updateSection(
          null,
          expect.any(String),
          updateSectionDto,
        ),
      ).toStrictEqual(section);
      expect(sectionService.updateSection).toHaveBeenCalledWith(
        expect.any(String),
        updateSectionDto,
        null
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(sectionService, 'updateSection')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.updateSection(
          image,
          expect.any(String),
          updateSectionDto,
        ),
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
