import { ForbiddenException, Injectable } from '@nestjs/common';
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
    try {
      answers.forEach(async (el) => {
        const answer = {
          questions: questionId,
          text: el,
          count: 0,
        };

        this.repository.save(answer);
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findById(questionId) {
    try {
      const answers = await this.repository.findBy({
        questions: { id: questionId },
      });

      return answers;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async delete(question) {
    try {
      const answers = await this.repository.findBy({
        questions: { id: question },
      });

      await answers.forEach(async (el) => {
        this.repository.delete(el.id);
      });

      return;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async voting(id, userId) {
    try {
      const answer = await this.repository.findOneBy(id);

      answer.count++;

      answer.users.push(userId);

      await this.repository.save(answer);
      return;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async unvoting(id, userId) {
    try {
      const answer = await this.repository.findOneBy(id);

      answer.count++;

      answer.users.push(userId);

      await this.repository.save(answer);
      return;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
