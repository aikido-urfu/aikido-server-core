import { Module } from '@nestjs/common';
import { Questions } from './entities/questions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { AnswersModule } from 'src/answers/answers.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [TypeOrmModule.forFeature([Questions]), AnswersModule],
  exports: [QuestionsService],
})
export class QuestionsModule {}
