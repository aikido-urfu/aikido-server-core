import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService],
  imports: [AuthModule, UsersModule],
  exports: [TelegramService],
})
export class TelegramModule {}
