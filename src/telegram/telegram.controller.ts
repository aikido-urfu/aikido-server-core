import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ExpiredPeriod,
  GetExpiredVotes,
  GetExpiringVotes,
  Start,
  TelegramId,
  Token,
  Votes,
} from './types';
import { TelegramService } from './telegram.service';
import { CreateTelegramDto } from './dto/create-telegram.dto';
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

  // https://stackoverflow.com/a/73821533
  @Get('expiredVotes')
  @ApiQuery({
    name: 'period',
    type: Number,
    required: false,
  })
  @ApiResponse(GetExpiredVotes)
  getExpired(@Query('period') period?: number) {
    return this.telegramService.getExpiredVotes(period);
  }

  @Get('expiringVotes')
  @ApiQuery({
    name: 'period',
    type: Number,
    required: false,
  })
  @ApiResponse(GetExpiringVotes)
  getExpiring(@Query('period') period?: number) {
    return this.telegramService.getExpiringVotes(period);
  }

  @Delete('/unsubscribe')
  @ApiBody(TelegramId)
  remove(@Body() body: { telegramUserID: string }) {
    return this.telegramService.remove(body.telegramUserID);
  }
}
