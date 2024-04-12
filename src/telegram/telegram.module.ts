import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { UsersModule } from 'src/users/users.module';
import { VotesModule } from 'src/votes/votes.module';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService],
  imports: [UsersModule, VotesModule],
})
export class TelegramModule {}
