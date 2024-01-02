import { diskStorage } from 'multer';
import {
  FILE_TYPE_VALIDATOR,
  FilenameGenerator,
  MAX_SIZE_VALIDATOR,
} from '../models/file-interceptor.model';
import { extname } from 'path';

export function getStorageConfig(destination: string) {
  return {
    storage: diskStorage({
      destination: destination,
      filename: generateFilename,
    }),
  };
}

export const generateFilename: FilenameGenerator = (req, file, cb) => {
  if (!FILE_TYPE_VALIDATOR.test(file.mimetype)) {
    return cb(null, '');
  }

  if (file.size > MAX_SIZE_VALIDATOR) {
    return cb(null, '');
  }
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
  const fileName = `${randomName}${extname(file.originalname)}`;
  return cb(null, fileName);
};
