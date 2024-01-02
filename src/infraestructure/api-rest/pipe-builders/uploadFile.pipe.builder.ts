import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  FILE_TYPE_VALIDATOR,
  MAX_SIZE_VALIDATOR,
} from '../models/file-interceptor.model';

@Injectable()
export class OptionalFilePipe implements PipeTransform {
  async transform(value: Express.Multer.File | null) {
    if (value && value.filename !== '') {
      if (!FILE_TYPE_VALIDATOR.test(value.mimetype)) {
        throw new UnprocessableEntityException(
          'Invalid file type. Only jpeg, jpg, and png are allowed',
        );
      }

      if (value.size > MAX_SIZE_VALIDATOR) {
        throw new UnprocessableEntityException('File is too large');
      }

      return value;
    } else {
      return null;
    }
  }
}
