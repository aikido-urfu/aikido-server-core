import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMail, PostMail } from './types';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('mail')
@ApiTags('mail')
@ApiBearerAuth()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody(PostMail)
  create(@UserId() userId, @Body() createMailDto: CreateMailDto) {
    return this.mailService.create(userId, createMailDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse(GetMail)
  findAll(@UserId() userId) {
    return this.mailService.findAll(userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  vote(@Param('id') id: string, @UserId() userId) {
    return this.mailService.readMail(userId, id);
  }
}
