import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersModule } from 'src/answers/answers.module';

@Module({
  controllers: [VotesController],
  providers: [VotesService],
  imports: [TypeOrmModule.forFeature([Vote]), QuestionsModule, AnswersModule],
})
export class VotesModule {}
