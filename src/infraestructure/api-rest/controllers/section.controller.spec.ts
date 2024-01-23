import { Test, TestingModule } from '@nestjs/testing';
import { SectionController } from './section.controller';
import { SectionService } from '../../../core/domain/services/section.service';
import { CreateSectionDto, UpdateSectionDto } from '../dtos/section.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from '../../../infraestructure/cloudinary-config/cloudinary.service';

describe('SectionController', () => {
  let sectionController: SectionController;
  let sectionService: SectionService;
  let cloudinaryService: CloudinaryService;

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
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
          },
        },
      ],
    }).compile();

    sectionController = module.get<SectionController>(SectionController);
    sectionService = module.get<SectionService>(SectionService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  const name = 'Section name';
  const image = { filename: 'test.jpg' } as Express.Multer.File;

  const section = {
    id: expect.any(String),
    name,
    image: image.filename,
  };

  const createSectionDto = new CreateSectionDto(name);

  const updateSectionDto = new UpdateSectionDto(name, image.filename);

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
    it('should create a section in development', async () => {
      process.env.NODE_ENV = 'development';

      jest.spyOn(sectionService, 'createSection').mockResolvedValue(section);

      expect(
        await sectionController.createSection(image, createSectionDto),
      ).toBe(section);
      expect(sectionService.createSection).toHaveBeenCalledWith({
        ...createSectionDto,
        image: image.filename,
      });
    });

    it('should create a section with image on cloudinary service in production', async () => {
      process.env.NODE_ENV = 'production';

      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue({ url: 'test.jpg' } as UploadApiResponse);
      jest.spyOn(sectionService, 'createSection').mockResolvedValue(section);

      expect(
        await sectionController.createSection(image, createSectionDto),
      ).toBe(section);
      expect(sectionService.createSection).toHaveBeenCalledWith({
        ...createSectionDto,
        image: image.filename,
      });
    });

    it('should return an Http Exception error when it happens in development', () => {
      process.env.NODE_ENV = 'development';

      jest
        .spyOn(sectionService, 'findSectionById')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.findSectionById(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return an Http Exception error when it happens in production', () => {
      process.env.NODE_ENV = 'production';

      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.createSection(image, createSectionDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateSection', () => {
    it('should update a section in development', async () => {
      process.env.NODE_ENV = 'development';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
      jest.spyOn(sectionService, 'updateSection').mockResolvedValue(section);

      expect(
        await sectionController.updateSection(
          image,
          expect.any(String),
          updateSectionDto,
        ),
      ).toBe(section);
      expect(sectionService.updateSection).toHaveBeenCalledWith(
        expect.any(String),
        {
          ...updateSectionDto,
          image: image.filename,
        },
      );
    });

    it('should update a section in production and image on cloudinary service', async () => {
      process.env.NODE_ENV = 'production';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);

      jest.spyOn(cloudinaryService, 'deleteImage').mockResolvedValue();
      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue({ url: 'test.jpg' } as UploadApiResponse);
      jest.spyOn(sectionService, 'updateSection').mockResolvedValue(section);

      expect(
        await sectionController.updateSection(
          image,
          expect.any(String),
          updateSectionDto,
        ),
      ).toBe(section);
      expect(sectionService.updateSection).toHaveBeenCalledWith(
        expect.any(String),
        {
          ...updateSectionDto,
          image: image.filename,
        },
      );
    });

    it('should update a section without a file', async () => {
      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
      jest.spyOn(sectionService, 'updateSection').mockResolvedValue(section);

      const updateSectionDtoWithoutFile = new UpdateSectionDto('New name');

      expect(
        await sectionController.updateSection(
          null,
          expect.any(String),
          updateSectionDtoWithoutFile,
        ),
      ).toBe(section);
      expect(sectionService.updateSection).toHaveBeenCalledWith(
        expect.any(String),
        updateSectionDtoWithoutFile,
      );
    });

    it('should return an Http Exception error when it happens in development', () => {
      process.env.NODE_ENV = 'development';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
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

    it('should return an Http Exception error when it happens in production', () => {
      process.env.NODE_ENV = 'production';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
      jest
        .spyOn(cloudinaryService, 'uploadImage')
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
      process.env.NODE_ENV = 'development';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
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

    it('should delete a section and image on cloudinary service', async () => {
      process.env.NODE_ENV = 'production';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
      jest.spyOn(cloudinaryService, 'deleteImage').mockResolvedValue();

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

    it('should return an Http Exception error when it happens in development', () => {
      process.env.NODE_ENV = 'development';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
      jest
        .spyOn(sectionService, 'deleteSection')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.deleteSection(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return an Http Exception error when it happens in production', () => {
      process.env.NODE_ENV = 'production';

      jest.spyOn(sectionService, 'findSectionById').mockResolvedValue(section);
      jest
        .spyOn(cloudinaryService, 'deleteImage')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        sectionController.deleteSection(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
