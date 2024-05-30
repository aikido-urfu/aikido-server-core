import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import Multer from 'multer';
import { fileStorage } from 'src/tools/storage';
import { Files_URL } from 'API_URL';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post('/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createFile(
    @UploadedFile(new ParseFilePipe({}))
    file: Multer.File,
  ) {
    const url = Files_URL + 'uploads/' + file.filename;

    const savedFile = await this.fileService.saveFile({
      url,
      name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      type: file.mimetype,
    });

    return {
      id: savedFile.id,
      url: url,
      name: savedFile.name,
      type: savedFile.type
    };
  }

  @Post('photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @UploadedFile(new ParseFilePipe({}))
    photo: Multer.File,
  ) {
    const url = Files_URL + 'uploads/' + photo.filename;

    return { url };
  }
}
