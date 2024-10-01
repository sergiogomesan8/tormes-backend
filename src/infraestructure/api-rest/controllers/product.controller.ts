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
import { UserTypes } from '../../../core/domain/services/roles-authorization/roles.decorator';
import { RolesGuard } from '../../../core/domain/services/roles-authorization/roles.guard';
import { UserType } from '../../../core/domain/models/user.model';

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
    if (!file) {
      throw new Error('No file provided');
    }

    return this.productService.createProduct(createProductDto, file);
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
    return await this.productService.updateProduct(id, updateProductDto, file);
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
    return await this.productService.deleteProduct(id);
  }
}
