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
    questions.forEach(async (el: Questions) => {
      const question = {
        vote: voteId,
        title: el.title,
        description: el.description,
        files: el.files,
        photos: el.files,
        isMultiply: el.isMultiply,
      };

      const newQuestion = this.repository.create(question);
      await this.repository.save(newQuestion);

      this.answersService.save(el.answers, newQuestion.id);
    });
  }

  async delete(vote) {
    const questions = await this.repository.findBy({ vote: { id: vote } });

    await questions.forEach(async (el) => {
      await this.answersService.delete(el.id);
      this.repository.delete(el.id);
    });

    return;
  }
}
