import { MAX_SIZE_VALIDATOR } from '../models/file-interceptor.model';
import { OptionalFilePipe } from './uploadFile.pipe.builder';
import { UnprocessableEntityException } from '@nestjs/common';

describe('OptionalFilePipe', () => {
  let pipe: OptionalFilePipe;

  beforeEach(() => {
    pipe = new OptionalFilePipe();
  });

  it('should return null if value is null', async () => {
    expect(await pipe.transform(null)).toBe(null);
  });

  it('should throw UnprocessableEntityException if file type is invalid', async () => {
    const file: Express.Multer.File = {
      filename: 'test',
      mimetype: 'invalid/type',
      size: MAX_SIZE_VALIDATOR - 1,
      // other properties...
    } as Express.Multer.File;

    await expect(pipe.transform(file)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('should throw UnprocessableEntityException if file is too large', async () => {
    const file: Express.Multer.File = {
      filename: 'test',
      mimetype: 'image/jpeg',
      size: MAX_SIZE_VALIDATOR + 1,
    } as Express.Multer.File;

    await expect(pipe.transform(file)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('should return the file if it is valid', async () => {
    const file: Express.Multer.File = {
      filename: 'test',
      mimetype: 'image/jpeg',
      size: MAX_SIZE_VALIDATOR - 1,
    } as Express.Multer.File;

    expect(await pipe.transform(file)).toBe(file);
  });
});
