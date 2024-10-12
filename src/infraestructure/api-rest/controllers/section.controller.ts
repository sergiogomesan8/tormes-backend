import {
  Body,
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
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { SectionService } from '../../../core/domain/services/section.service';
import { Section } from '../../../core/domain/models/section.model';
import { CreateSectionDto, UpdateSectionDto } from '../dtos/section.dto';
import { JwtAuthGuard } from '../../../core/domain/services/jwt-config/access-token/access-jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { getStorageConfig } from '../helpers/file-upload.helper';
import { FileInterceptorSavePath } from '../models/file-interceptor.model';
import { UserTypes } from '../../../core/domain/services/roles-authorization/roles.decorator';
import { UserType } from '../../../core/domain/models/user.model';
import { RolesGuard } from '../../../core/domain/services/roles-authorization/roles.guard';
import { OptionalFilePipe } from '../pipe-builders/uploadFile.pipe.builder';

@ApiTags('section')
@ApiBearerAuth()
@ApiNoContentResponse({ description: 'No content.' })
@ApiBadRequestResponse({ description: 'Bad request. Invalid data provided.' })
@ApiUnauthorizedResponse({
  description: 'Unauthorized. User authentication failed.',
})
@ApiForbiddenResponse({ description: 'Forbidden.' })
@ApiInternalServerErrorResponse({ description: 'Internet Server Error.' })
@UseFilters(new HttpExceptionFilter())
@Controller('section')
export class SectionController {
  private readonly logger = new Logger(SectionController.name);

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
  @ApiNotFoundResponse({
    description: 'Not found. The specified ID does not exist.',
  })
  @Get('/:id')
  async findSectionById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Section> {
    const section = await this.sectionService.findSectionById(id);
    if (section) {
      return section;
    } else {
      this.logger.error(`Section with ${id} not found`);
      throw new NotFoundException('Section Not Found');
    }
  }

  @ApiOperation({
    summary: 'Create a section',
    description: 'Endpoint to create a section',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Section data and image file',
    type: CreateSectionDto,
  })
  @ApiNotFoundResponse({
    description: 'Not found. The specified ID does not exist.',
  })
  @UseInterceptors(
    FileInterceptor(
      'image',
      getStorageConfig(FileInterceptorSavePath.SECTIONS),
    ),
  )
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createSection(
    @UploadedFile(new OptionalFilePipe()) file: Express.Multer.File,
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    if (!file) {
      throw new Error('No file provided');
    }
    return await this.sectionService.createSection(createSectionDto, file);
  }

  @ApiOperation({
    summary: 'Update a section by ID',
    description: 'Endpoint to update a section by ID',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the section' })
  @ApiBody({
    description: 'Section data and image file',
    type: UpdateSectionDto,
  })
  @ApiNotFoundResponse({
    description: 'Not found. The specified ID does not exist.',
  })
  @UseInterceptors(
    FileInterceptor(
      'image',
      getStorageConfig(FileInterceptorSavePath.SECTIONS),
    ),
  )
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id')
  async updateSection(
    @UploadedFile(new OptionalFilePipe()) file: Express.Multer.File | null,
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return await this.sectionService.updateSection(id, updateSectionDto, file);
  }

  @ApiOperation({
    summary: 'Delete a section by ID',
    description: 'Endpoint to delete a section by ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the section' })
  @UserTypes(UserType.manager, UserType.employee)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  async deleteSection(@Param('id') id: string) {
    return await this.sectionService.deleteSection(id);
  }
}
