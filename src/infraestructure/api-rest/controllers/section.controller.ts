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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { SectionService } from '../../../core/domain/services/section.service';
import { Section } from '../../../core/domain/models/section.model';
import { CreateSectionDto, UpdateSectionDto } from '../dtos/section.dto';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/jwt-auth.guard';

@ApiTags('section')
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
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @ApiOperation({
    summary: 'Retrieve all sections',
    description: 'Endpoint to get a list of all sections',
  })
  @Get('/list')
  async findAllSections(): Promise<Section[]> {
    return await this.sectionService.findAllSections();
  }

  @ApiOperation({
    summary: 'Retrieve a section by ID',
    description: 'Endpoint to get a section by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the section' })
  @Get('/:id')
  async findSectionById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Section> {
    return await this.sectionService.findSectionById(id);
  }

  @ApiOperation({
    summary: 'Create a section',
    description: 'Endpoint to create a section',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    return this.sectionService.createSection(createSectionDto);
  }

  @ApiOperation({
    summary: 'Update a section by ID',
    description: 'Endpoint to update a section by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the section' })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return await this.sectionService.updateSection(id, updateSectionDto);
  }

  @ApiOperation({
    summary: 'Delete a section by ID',
    description: 'Endpoint to delete a section by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the section' })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.sectionService.deleteSection(id);
  }
}
