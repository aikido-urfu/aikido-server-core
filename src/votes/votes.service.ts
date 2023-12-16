import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private repository: Repository<Vote>,
    private questionsService: QuestionsService,
  ) {}

  async create(createVoteDto: CreateVoteDto, userId: number) {
    const {
      title,
      isAnonymous,
      isHidenCount,
      isPrivate,
      questions,
      description,
      isActive,
      dateOfStart,
      dateOfEnd,
      privateUsers,
      files,
      photos,
    } = createVoteDto;

    if (!userId || !title || !questions || !questions.length) {
      throw new ForbiddenException('Отсутсвуют необходимые поля');
    }

    const voteData = {
      user: userId as DeepPartial<User>,
      title,
      description,
      isActive: isActive ?? true,
      dateOfStart,
      dateOfEnd,
      creationDate: Date.now() + '',
      isPrivate: isPrivate ?? false,
      isAnonymous: isAnonymous ?? true,
      isHidenCount: isHidenCount ?? false,
      privateUsers,
      files,
      photos,
    };

    const newVote = this.repository.create(voteData);
    await this.repository.save(newVote);

    this.questionsService.save(questions, newVote.id);
  }

  async findAll() {
    const votes = await this.repository.find({
      relations: ['user'],
    });

    const result = [];

    await votes.forEach((el) => {
      result.push({
        id: el.id,
        title: el.title,
        description: el.description,
        dateOfStart: el.dateOfStart,
        dateOfEnd: el.dateOfEnd,
        creationDate: el.creationDate,
        isAnonymous: el.isAnonymous,
        isActive: el.isActive,
        isPrivate: el.isPrivate,
        privateUsers: el.privateUsers,
        photos: [],
      });
    });

    return { votes: result };
  }

  async findOne(id: number) {
    const vote = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    return { ...vote };
  }

  async update(id: number, updateVoteDto: UpdateVoteDto) {
    const {
      title,
      isAnonymous,
      isHidenCount,
      isPrivate,
      questions,
      description,
      isActive,
      dateOfStart,
      dateOfEnd,
      privateUsers,
      files,
      photos,
    } = updateVoteDto;

    if (!id || !title || !questions || !questions.length) {
      throw new ForbiddenException('Отсутсвуют необходимые поля');
    }

    const voteData = {
      title,
      description,
      isActive: isActive ?? true,
      dateOfStart,
      dateOfEnd,
      creationDate: Date.now() + '',
      isPrivate: isPrivate ?? false,
      isAnonymous: isAnonymous ?? true,
      isHidenCount: isHidenCount ?? false,
      privateUsers,
      files,
      photos,
    };

    const oldVote = await this.repository.findOneBy({ id });
    const newVote = { ...oldVote, ...voteData };

    await this.repository.save(newVote);
  }

  async voting(id: number) {
    ///
  }

  async remove(id: number, userId: number) {
    try {
      const vote = await this.repository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (Number(vote.user.id) !== userId) {
        throw new ForbiddenException('Недостаточно прав');
      }

      await this.questionsService.delete(id);
      this.repository.delete(id);
    } catch (error) {
      throw new ForbiddenException('Такого id не существует');
    }
  }
}
