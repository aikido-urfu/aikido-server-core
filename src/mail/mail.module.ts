import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [TypeOrmModule.forFeature([Mail]), UsersModule],
  exports: [MailService],
})
export class MailModule {}
