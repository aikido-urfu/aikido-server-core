import { Injectable } from '@nestjs/common';
import { Answers } from './entities/answers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answers)
    private repository: Repository<Answers>,
  ) {}

  async save(answers, questionId) {
    answers.forEach(async (el) => {
      const answer = {
        questions: questionId,
        text: el,
        count: 0,
      };

      this.repository.save(answer);
    });
  }
}
