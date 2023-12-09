import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questions } from './entities/questions.entity';
import { AnswersService } from 'src/answers/answers.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Questions)
    private repository: Repository<Questions>,
    private readonly answersService: AnswersService,
  ) {}

  async save(questions, voteId) {
    questions.forEach(async (el) => {
      const maxId = await this.repository
        .createQueryBuilder('questions')
        .select('MAX(questions.id)', 'maxId')
        .getRawOne();

      const question = {
        id: maxId + 1,
        vote: voteId,
        title: el.title,
        description: el.description,
        files: el.files,
        photos: el.files,
        isMultiply: el.isMultiply,
      };

      this.answersService.save(questions.answers, maxId + 1);

      this.repository.save(question);
    });
  }
}
