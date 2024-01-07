import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [TypeOrmModule.forFeature([Mail])],
})
export class MailModule {}
