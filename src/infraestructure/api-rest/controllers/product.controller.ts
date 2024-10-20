import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
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
import { SerializedProduct } from '../../../core/domain/models/product.model';
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
@ApiInternalServerErrorResponse({ description: 'Internet Server Error.' })
@UseFilters(new HttpExceptionFilter())
@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Retrieve all products',
    description: 'Endpoint to get a list of all products',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/list')
  async findAllProducts(): Promise<SerializedProduct[]> {
    const products = await this.productService.findAllProducts();
    return products.map((product) => new SerializedProduct(product));
  }

  @ApiOperation({
    summary: 'Retrieve a product by ID',
    description: 'Endpoint to get a product by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  @ApiNotFoundResponse({
    description: 'Not found. The specified ID does not exist.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async findProductById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SerializedProduct> {
    const product = await this.productService.findProductById(id);
    if (product) {
      const serializedProduct = new SerializedProduct(product);
      return serializedProduct;
    } else {
      this.logger.error(`Product with ${id} not found`);
      throw new NotFoundException('Product Not Found');
    }
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createProduct(
    @UploadedFile(new OptionalFilePipe()) file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ): Promise<SerializedProduct> {
    if (!file) {
      throw new Error('No file provided');
    }
    const product = await this.productService.createProduct(
      createProductDto,
      file,
    );
    if (product) {
      const serializedProduct = new SerializedProduct(product);
      return serializedProduct;
    }
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
  @ApiNotFoundResponse({
    description: 'Not found. The specified ID does not exist.',
  })
  @UseInterceptors(
    FileInterceptor(
      'image',
      getStorageConfig(FileInterceptorSavePath.PRODUCTS),
    ),
  )
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  async updateProduct(
    @UploadedFile(new OptionalFilePipe()) file: Express.Multer.File | null,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<SerializedProduct> {
    const product = await this.productService.updateProduct(
      id,
      updateProductDto,
      file,
    );
    if (product) {
      const serializedProduct = new SerializedProduct(product);
      return serializedProduct;
    }
  }

  @ApiOperation({
    summary: 'Delete a product by ID',
    description: 'Endpoint to delete a product by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  @ApiNotFoundResponse({
    description: 'Not found. The specified ID does not exist.',
  })
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }
}
