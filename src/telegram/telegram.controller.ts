import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Mail, Start, TelegramId, Votes } from './types';

@Controller('telegram')
@ApiTags('telegram')
@ApiBearerAuth()
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('/start')
  @ApiBody(Start)
  create(@Body() createTelegramDto: CreateTelegramDto) {
    return this.telegramService.create(createTelegramDto);
  }

  @Get('/votes')
  @ApiBody(TelegramId)
  @ApiResponse(Votes)
  findAll() {
    return this.telegramService.findAll();
  }

  @Get('/mail')
  @ApiBody(TelegramId)
  @ApiResponse(Mail)
  findOne(@Param('id') id: string) {
    return this.telegramService.findOne(+id);
  }

  @Delete('/unsubscribe')
  @ApiBody(TelegramId)
  remove(@Param('id') id: string) {
    return this.telegramService.remove(+id);
  }
}
