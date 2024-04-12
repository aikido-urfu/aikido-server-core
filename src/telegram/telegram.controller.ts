import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Start, TelegramId, Votes } from './types';

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
  findAll(@Body() body: { tgid: string }) {
    return this.telegramService.findAll(body.tgid);
  }

  @Delete('/unsubscribe')
  @ApiBody(TelegramId)
  remove(@Param('id') id: string) {
    return this.telegramService.remove(+id);
  }
}
