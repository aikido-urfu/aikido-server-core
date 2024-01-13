import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [TypeOrmModule.forFeature([Mail]), UsersModule, FilesModule],
  exports: [MailService],
})
export class MailModule {}
