import { MAX_SIZE_VALIDATOR } from '../models/file-interceptor.model';
import { getStorageConfig, generateFilename } from './file-upload.helper';
import { diskStorage } from 'multer';

jest.mock('multer');
jest.mock('path', () => ({
  extname: jest.fn((filename) => filename.slice(filename.lastIndexOf('.'))),
}));

describe('File Upload Helper', () => {
  describe('getStorageConfig', () => {
    it('should return correct config', () => {
      const destination = 'test_destination';
      const config = getStorageConfig(destination);

      expect(config).toEqual({
        storage: diskStorage({
          destination: destination,
          filename: generateFilename,
        }),
      });
    });
  });

  describe('generateFilename', () => {
    it('should generate correct filename', () => {
      const req = {};
      const file = {
        mimetype: 'image/jpg',
        size: MAX_SIZE_VALIDATOR - 1,
        originalname: 'test.jpg',
      };
      const cb = jest.fn();

      generateFilename(req, file, cb);

      expect(cb).toHaveBeenCalled();
      const filename = cb.mock.calls[0][1];
      expect(filename).toMatch(/^[0-9a-f]{32}\.jpg$/);
    });

    it('should return empty filename for invalid mimetype', () => {
      const req = {};
      const file = {
        mimetype: 'invalid/mimetype',
        size: MAX_SIZE_VALIDATOR - 1,
        originalname: 'test.jpg',
      };
      const cb = jest.fn();

      generateFilename(req, file, cb);

      expect(cb).toHaveBeenCalledWith(null, '');
    });

    it('should return empty filename for size exceeding max limit', () => {
      const req = {};
      const file = {
        mimetype: 'image/jpeg',
        size: MAX_SIZE_VALIDATOR + 1,
        originalname: 'test.jpg',
      };
      const cb = jest.fn();

      generateFilename(req, file, cb);

      expect(cb).toHaveBeenCalledWith(null, '');
    });
  });
});
