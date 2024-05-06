import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from 'src/votes/entities/vote.entity';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService],
  imports: [TypeOrmModule.forFeature([User, Vote]), UsersModule],
  exports: [TelegramService],
})
export class TelegramModule {}
