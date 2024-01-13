import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questions } from './entities/questions.entity';
import { AnswersService } from 'src/answers/answers.service';
import { saveFile } from 'src/tools/saveFile';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Questions)
    private repository: Repository<Questions>,
    private readonly answersService: AnswersService,
  ) {}

  async save(questions, voteId) {
    try {
      questions.forEach(async (el: Questions) => {
        const question = {
          vote: voteId,
          title: el.title,
          description: el.description,
          files: el.files,
          photos: el.photos,
          isMultiply: el.isMultiply,
        };

        const newQuestion = await this.repository.create(question);
        await this.repository.save(newQuestion);
        await this.answersService.save(el.answers, newQuestion.id);
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async delete(vote) {
    try {
      const questions = await this.repository.findBy({ vote: { id: vote } });

      await questions.forEach(async (el) => {
        await this.answersService.delete(el.id);
        await this.repository.delete(el.id);
      });

      return;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
