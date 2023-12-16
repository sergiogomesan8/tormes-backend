import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
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
} from '@nestjs/swagger';
import { ProductService } from '../../../core/domain/services/product.service';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/jwt-auth.guard';
import { Product } from '../../../core/domain/models/product.model';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

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
    return await this.productService.findProductById(id);
  }

  @ApiOperation({
    summary: 'Create a product',
    description: 'Endpoint to create a product',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @ApiOperation({
    summary: 'Update a product by ID',
    description: 'Endpoint to update a product by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Delete a product by ID',
    description: 'Endpoint to delete a product by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }
}
