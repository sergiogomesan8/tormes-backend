import { Test, TestingModule } from '@nestjs/testing';
import { SectionService } from './section.service';
import { QueryFailedError, Repository } from 'typeorm';
import { SectionEntity } from '../../../infraestructure/postgres/entities/section.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Section } from '../models/section.model';
import {
  CreateSectionDto,
  UpdateSectionDto,
} from '../../../infraestructure/api-rest/dtos/section.dto';
import { IImageService } from '../ports/inbound/image.service.interface';

describe('SectionService', () => {
  let sectionService: SectionService;
  let sectionRepository: Repository<SectionEntity>;
  let imageService: IImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionService,
        {
          provide: getRepositoryToken(SectionEntity),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'IImageService',
          useValue: {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
          },
        },
      ],
    }).compile();

    sectionService = module.get<SectionService>(SectionService);
    sectionRepository = module.get<Repository<SectionEntity>>(
      getRepositoryToken(SectionEntity),
    );
    imageService = module.get<IImageService>('IImageService');
  });

  const name = 'Section name';
  const image = 'https://example.com/image.jpg';
  const file: Express.Multer.File = {
    fieldname: 'image',
    originalname: 'producto.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('contenido_simulado_de_imagen'),
    size: 1024,
  } as Express.Multer.File;

  const section: Section = {
    id: expect.any(String),
    name,
    image,
  };

  const createSectionDto = new CreateSectionDto(name);

  const updateSectionDto = new UpdateSectionDto(name);

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
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        sectionService.findSectionById(expect.any(String)),
      ).rejects.toThrow('Database error');
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
    });

    it('should throw an error when it happens', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockRejectedValue(new Error());

      await expect(
        sectionService.findSectionById(expect.any(String)),
      ).rejects.toThrow(Error);
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
    });
  });

  describe('createSection', () => {
    it('should create a section', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(sectionRepository, 'create')
        .mockImplementation(() => section as SectionEntity);
      jest
        .spyOn(sectionRepository, 'save')
        .mockImplementation(() => Promise.resolve(section as SectionEntity));

      const result = await sectionService.createSection(createSectionDto, file);

      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(sectionRepository.create).toHaveBeenCalledWith({
        ...createSectionDto,
        image: image,
      });
      expect(sectionRepository.save).toHaveBeenCalledWith(section);
      expect(result).toEqual(section);
    });

    it('should throw an error when section name already exists', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(sectionRepository, 'create')
        .mockImplementation(() => section as SectionEntity);
      jest.spyOn(sectionRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query', [], new Error());
      });

      try {
        await sectionService.createSection(createSectionDto, file);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(sectionRepository.create).toHaveBeenCalledWith({
        ...createSectionDto,
        image: image,
      });
      expect(sectionRepository.save).toHaveBeenCalledWith(section);
      expect(sectionRepository.save).toHaveBeenCalledWith(section);
    });

    it('should throw an error if upload image fails', async () => {
      jest
        .spyOn(imageService, 'uploadImage')
        .mockRejectedValue(new Error('Upload failed'));

      const result = await sectionService.createSection(createSectionDto, file);

      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(result).toBeUndefined();
    });

    it('should throw an error if creation on database fails', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest.spyOn(sectionRepository, 'create').mockImplementation(() => {
        throw new Error('Create error');
      });

      try {
        await sectionService.createSection(createSectionDto, file);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Create error');
      }
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(sectionRepository.create).toHaveBeenCalledWith({
        ...createSectionDto,
        image: image,
      });
    });

    it('should throw an error if save on database fails', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(sectionRepository, 'create')
        .mockImplementation(() => section as SectionEntity);
      jest.spyOn(sectionRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await sectionService.createSection(createSectionDto, file);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(sectionRepository.create).toHaveBeenCalledWith({
        ...createSectionDto,
        image: image,
      });
    });
  });
  describe('updateSection', () => {
    it('should update a section', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as SectionEntity)
        .mockResolvedValue(section as SectionEntity);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await sectionService.updateSection(
        'id',
        updateSectionDto,
        file,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);

      expect(sectionRepository.update).toHaveBeenCalledWith(section.id, {
        ...updateSectionDto,
        image,
      });
      expect(result).toEqual(section);
    });

    it('should update a section with no file', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as SectionEntity)
        .mockResolvedValue(section as SectionEntity);
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await sectionService.updateSection(
        'id',
        updateSectionDto,
        null,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(result).toEqual(section);
    });

    it('should throw an error when no section is found to update', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockRejectedValue(new Error());

      const result = await sectionService.updateSection(
        'id',
        updateSectionDto,
        null,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(result).toBeUndefined();
    });

    it('should throw an Error when delete image fails', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as SectionEntity);
      jest
        .spyOn(imageService, 'deleteImage')
        .mockRejectedValue(new Error('Error'));

      const result = await sectionService.updateSection(
        section.id,
        updateSectionDto,
        file,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
      expect(result).toBeUndefined();
    });

    it('should throw an Error when upload image fails', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as SectionEntity);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest
        .spyOn(imageService, 'uploadImage')
        .mockRejectedValue(new Error('Error'));

      const result = await sectionService.updateSection(
        section.id,
        updateSectionDto,
        file,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(result).toBeUndefined();
    });

    it('should throw an error on update method when it happens with File', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as SectionEntity);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest.spyOn(sectionRepository, 'update').mockRejectedValue(new Error());

      const result = await sectionService.updateSection(
        section.id,
        updateSectionDto,
        file,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(sectionRepository.update).toHaveBeenCalledWith(section.id, {
        ...updateSectionDto,
        image,
      });
      expect(result).toBeUndefined();
    });

    it('should throw an error on update method when it happens with no File', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as SectionEntity);
      jest.spyOn(sectionRepository, 'update').mockRejectedValue(new Error());

      const result = await sectionService.updateSection(
        section.id,
        updateSectionDto,
        null,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(sectionRepository.update).toHaveBeenCalledWith(section.id, {
        ...updateSectionDto,
        image: section.image,
      });
      expect(result).toBeUndefined();
    });

    it('should throw an Error when no section is found after update with File', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValueOnce(section as SectionEntity)
        .mockRejectedValueOnce(new Error());
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await sectionService.updateSection(
        section.id,
        updateSectionDto,
        file,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledTimes(2);
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(sectionRepository.update).toHaveBeenCalledWith(section.id, {
        ...updateSectionDto,
        image,
      });
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(result).toBeUndefined();
    });

    it('should throw an Error when no section is found after update with no File', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValueOnce(section as SectionEntity)
        .mockRejectedValueOnce(new Error());
      jest
        .spyOn(sectionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await sectionService.updateSection(
        section.id,
        updateSectionDto,
        null,
      );

      expect(sectionRepository.findOne).toHaveBeenCalledTimes(2);
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('deleteSection', () => {
    it('should delete a section when section exists', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(section);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest
        .spyOn(sectionRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await sectionService.deleteSection(section.id);

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
      expect(sectionRepository.delete).toHaveBeenCalledWith(section.id);
      expect(result).toEqual({
        message: `Section with id ${section.id} was deleted.`,
      });
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockRejectedValue(new Error());
      await expect(sectionService.deleteSection(section.id)).rejects.toThrow(
        Error,
      );
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
    });

    it('should throw error when delete method throws an error', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(section);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(sectionRepository, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await expect(sectionService.deleteSection(section.id)).rejects.toThrow(
        'Error',
      );
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
    });

    it('should throw error when delete image throws an error', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(section);
      jest
        .spyOn(imageService, 'deleteImage')
        .mockRejectedValue(new Error('Error'));

      await expect(sectionService.deleteSection(section.id)).rejects.toThrow(
        'Error',
      );

      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: section.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(section.image);
    });
  });
});
