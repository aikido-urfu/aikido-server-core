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
      const maxId = await this.repository
        .createQueryBuilder('answers')
        .select('MAX(answers.id)', 'maxId')
        .getRawOne();

      const answer = {
        id: maxId + 1,
        question: questionId,
        title: el.title,
        description: el.description,
        files: el.files,
        photos: el.files,
        isMultiply: el.isMultiply,
      };

      this.repository.save(answer);
    });
  }
}
