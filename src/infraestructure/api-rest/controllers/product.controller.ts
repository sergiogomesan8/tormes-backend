import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiOperation,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { OptionalFilePipe } from '../pipe-builders/uploadFile.pipe.builder';
import {
  FILE_TYPE_VALIDATOR,
  FileInterceptorSavePath,
  MAX_SIZE_VALIDATOR,
} from '../models/file-interceptor.model';
import { ProductService } from '../../../core/domain/services/product.service';
import { Product } from '../../../core/domain/models/product.model';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/jwt-auth.guard';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('product')
@ApiBearerAuth()
@ApiNoContentResponse({ description: 'No content.' })
@ApiBadRequestResponse({ description: 'Bad request. Invalid data provided.' })
@ApiUnauthorizedResponse({
  description: 'Unauthorized. User authentication failed.',
})
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiNotFoundResponse({
  description: 'Not found. The specified ID does not exist.',
})
@ApiInternalServerErrorResponse({ description: 'Internet Server Error.' })
@UseFilters(new HttpExceptionFilter())
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Retrieve all products',
    description: 'Endpoint to get a list of all products',
  })
  @Get('/list')
  async findAllProducts(): Promise<Product[]> {
    return await this.productService.findAllProducts();
  }

  @ApiOperation({
    summary: 'Retrieve a product by ID',
    description: 'Endpoint to get a product by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  @Get('/:id')
  async findProductById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Product> {
    const product = await this.productService.findProductById(id);
    return product;
  }

  @ApiOperation({
    summary: 'Create a product',
    description: 'Endpoint to create a product',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data and image file',
    type: CreateProductDto,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: FileInterceptorSavePath.PRODUCTS,
        filename: (req, file, cb) => {
          const mime = file.mimetype;

          if (!FILE_TYPE_VALIDATOR.test(mime)) {
            return cb(null, '');
          }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const fileName = `${randomName}${extname(file.originalname)}`;
          return cb(null, fileName);
        },
      }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: FILE_TYPE_VALIDATOR,
        })
        .addMaxSizeValidator({ maxSize: MAX_SIZE_VALIDATOR })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct({
      ...createProductDto,
      image: file.filename,
    });
  }

  @ApiOperation({
    summary: 'Update a product by ID',
    description: 'Endpoint to update a product by ID',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  @ApiBody({
    description: 'Product data and image file',
    type: UpdateProductDto,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: FileInterceptorSavePath.PRODUCTS,
        filename: (req, file, cb) => {
          if (file) {
            const mime = file.mimetype;

            if (!FILE_TYPE_VALIDATOR.test(mime)) {
              return cb(null, '');
            }
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            const fileName = `${randomName}${file.filename}`;
            return cb(null, fileName);
          } else {
            return cb(null, '');
          }
        },
      }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateProduct(
    @UploadedFile(new OptionalFilePipe()) file: Express.Multer.File | null,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (file.filename !== '') {
      const existingProduct = await this.productService.findProductById(id);
      const existingImage = existingProduct.image;
      const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${existingImage}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      return await this.productService.updateProduct(id, {
        ...updateProductDto,
        image: file.filename,
      });
    } else {
      return await this.productService.updateProduct(id, updateProductDto);
    }
  }

  @ApiOperation({
    summary: 'Delete a product by ID',
    description: 'Endpoint to delete a product by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const existingProduct = await this.productService.findProductById(id);
    const existingImage = existingProduct.image;
    if (existingImage) {
      const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${existingImage}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return await this.productService.deleteProduct(id);
  }
}
