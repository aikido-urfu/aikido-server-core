import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from 'src/answers/answers.module';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [VotesController],
  providers: [VotesService],
  imports: [
    TypeOrmModule.forFeature([Vote]),
    UsersModule,
    QuestionsModule,
    AnswersModule,
    FilesModule,
  ],
  exports: [VotesService],
})
export class VotesModule {}
