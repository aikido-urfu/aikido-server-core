import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import Multer from 'multer';
import { fileStorage } from 'src/tools/storage';
import { Files_URL, Server_URL } from 'API_URL';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('files')
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @UseGuards(JwtAuthGuard)
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
    const url = Server_URL + 'files/' + file.filename;

    const savedFile = await this.fileService.saveFile({
      url,
      name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      type: file.mimetype,
    });

    return {
      id: savedFile.id,
      url: url,
      name: savedFile.name,
      type: savedFile.type,
    };
  }

  @Post('photo')
  @UseGuards(JwtAuthGuard)
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
    const url = Server_URL + 'files/' + photo.filename;

    return { url };
  }

  @Get('/:name')
  async getFile(@Param('name') name: string, @Res() res: Response) {
    const fileInfo = await this.fileService.getByURL(
      `${Server_URL}files/${name}`,
    );
    console.log(fileInfo);
    if (!fileInfo) {
      res.send(readFileSync(join(process.cwd(), `/uploads/${name}`)));
    } else {
      const file = readFileSync(join(process.cwd(), `/uploads/${name}`));
      res.attachment(fileInfo.name);
      res.send(file);
    }
  }
}
