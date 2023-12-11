import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
} from '@nestjs/swagger';
import { ProductService } from '../../../core/domain/services/product.service';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/jwt-auth.guard';
import { Product } from 'src/core/domain/models/product.model';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

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
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  async findAllProducts(): Promise<Product[]> {
    return await this.productService.findAllProducts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneProductById(id: string): Promise<Product> {
    return await this.productService.findProductById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProduct(@Body() createProductDto: CreateProductDto): Product {
    return this.productService.createProduct(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':productId')
  async deleteProduct(@Param('domainId') domainId: string) {
    return await this.productService.deleteProduct(domainId);
  }
}
