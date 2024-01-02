import { diskStorage } from 'multer';
import {
  FILE_TYPE_VALIDATOR,
  FilenameGenerator,
  MAX_SIZE_VALIDATOR,
} from '../models/file-interceptor.model';
import { extname } from 'path';
import { randomBytes } from 'crypto';

export function getStorageConfig(destination: string) {
  return {
    storage: diskStorage({
      destination: destination,
      filename: generateFilename,
    }),
    limits: {
      fileSize: MAX_SIZE_VALIDATOR,
    },
  };
}

export const generateFilename: FilenameGenerator = (req, file, cb) => {
  if (!FILE_TYPE_VALIDATOR.test(file.mimetype)) {
    return cb(null, '');
  }

  if (file.size > MAX_SIZE_VALIDATOR) {
    return cb(null, '');
  }
  const randomName = randomBytes(16).toString('hex');
  const fileName = `${randomName}${extname(file.originalname)}`;
  return cb(null, fileName);
};
