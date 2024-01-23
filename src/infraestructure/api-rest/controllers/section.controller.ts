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
import { CloudinaryService } from '../../../infraestructure/cloudinary-config/cloudinary.service';
import * as fs from 'fs';

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
  constructor(
    private readonly sectionService: SectionService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Section data and image file',
    type: CreateSectionDto,
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
    let image;
    if (file) {
      image =
        process.env.NODE_ENV === 'production'
          ? ((await this.cloudinaryService.uploadImage(file)).url as string)
          : file.filename;
    } else {
      throw new Error('No file provided');
    }

    return this.sectionService.createSection({
      ...createSectionDto,
      image,
    });
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
    if (file) {
      let image;
      const existingProduct = await this.sectionService.findSectionById(id);

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

      return await this.sectionService.updateSection(id, {
        ...updateSectionDto,
        image,
      });
    } else {
      return await this.sectionService.updateSection(id, updateSectionDto);
    }
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
    const existingSection = await this.sectionService.findSectionById(id);
    const existingImage = existingSection.image;
    if (existingImage) {
      if (process.env.NODE_ENV === 'production') {
        await this.cloudinaryService.deleteImage(existingSection.image);
      } else {
        const imagePath = `${FileInterceptorSavePath.PRODUCTS}/${existingImage}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    return await this.sectionService.deleteSection(id);
  }
}
