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
import { API_URL } from 'API_URL';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post()
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
  async create(
    @UploadedFile(new ParseFilePipe({}))
    file: Multer.File,
  ) {
    const url = API_URL + 'uploads/' + file.filename;

    await this.fileService.saveFile({
      id: url,
      name: file.originalname,
      type: file.type,
    });

    return {
      url: API_URL + 'uploads/' + file.filename,
      name: file.originalname,
      type: file.type,
    };
  }
}
