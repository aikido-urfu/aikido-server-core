import { Module } from '@nestjs/common';
import { Answers } from './entities/answers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [TypeOrmModule.forFeature([Answers])],
  exports: [AnswersService],
})
export class AnswersModule {}
