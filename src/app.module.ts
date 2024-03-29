import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesModule } from './votes/votes.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Vote } from './votes/entities/vote.entity';
import { Questions } from './questions/entities/questions.entity';
import { Answers } from './answers/entities/answers.entity';
import { TelegramModule } from './telegram/telegram.module';
import { MailModule } from './mail/mail.module';
import { Mail } from './mail/entities/mail.entity';
import { FilesModule } from './files/files.module';
import { Files } from './files/entities/files.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MailModule,
    VotesModule,
    AuthModule,
    FilesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Vote, Questions, Answers, Mail, Files],
      synchronize: true,
    }),
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
