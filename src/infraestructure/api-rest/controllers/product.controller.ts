import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import { ProductService } from '../../../core/domain/services/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { OptionalFilePipe } from '../pipe-builders/uploadFile.pipe.builder';
import { FileInterceptorSavePath } from '../models/file-interceptor.model';
import { Product } from '../../../core/domain/models/product.model';
import { getStorageConfig } from '../helpers/file-upload.helper';
import * as fs from 'fs';
import { UserTypes } from '../../../core/domain/services/roles-authorization/roles.decorator';
import { RolesGuard } from '../../../core/domain/services/roles-authorization/roles.guard';
import { UserType } from '../../../core/domain/models/user.model';
import { CloudinaryService } from '../../cloudinary-config/cloudinary.service';

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
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
    return await this.productService.findProductById(id);
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
    FileInterceptor(
      'image',
      getStorageConfig(FileInterceptorSavePath.PRODUCTS),
    ),
  )
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createProduct(
    @UploadedFile(new OptionalFilePipe()) file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    let image;
    if (file) {
      image =
        process.env.NODE_ENV === 'production'
          ? ((await this.cloudinaryService.uploadImage(file)).url as string)
          : file.filename;
    } else {
      throw new Error('No file provided');
    }

    return this.productService.createProduct({
      ...createProductDto,
      image,
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
    FileInterceptor(
      'image',
      getStorageConfig(FileInterceptorSavePath.PRODUCTS),
    ),
  )
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id')
  async updateProduct(
    @UploadedFile(new OptionalFilePipe()) file: Express.Multer.File | null,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (file) {
      let image;
      const existingProduct = await this.productService.findProductById(id);

      if (process.env.NODE_ENV === 'production') {
        await this.cloudinaryService.deleteImage(existingProduct.image);
        const uploadResponse = await this.cloudinaryService.uploadImage(file);
        image = uploadResponse.url as string;
      } else {
        const existingImage = existingProduct.image;
        const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${existingImage}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        image = file.filename;
      }

      return await this.productService.updateProduct(id, {
        ...updateProductDto,
        image,
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
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const existingProduct = await this.productService.findProductById(id);
    const existingImage = existingProduct.image;
    if (existingImage) {
      if (process.env.NODE_ENV === 'production') {
        await this.cloudinaryService.deleteImage(existingProduct.image);
      } else {
        const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${existingImage}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    return await this.productService.deleteProduct(id);
  }
}
