import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Start, TelegramId, Token, Votes } from './types';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('telegram')
@ApiTags('telegram')
@ApiBearerAuth()
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('/token')
  @UseGuards(JwtAuthGuard)
  @ApiResponse(Token)
  getToken(@UserId() id: number) {
    return this.telegramService.getToken(id);
  }

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
  remove(@Body() body: { telegramUserID: string }) {
    return this.telegramService.remove(body.telegramUserID);
  }
}
