import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { User } from 'src/users/entities/user.entity';
import { AnswersService } from 'src/answers/answers.service';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';
import multer, { Multer } from 'multer';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private repository: Repository<Vote>,
    private usersService: UsersService,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private filesService: FilesService,
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

    const filesIds = [];

    if (files && files.length) {
      for (const file of files) {
        const savedFile = await this.filesService.create(file);
        // filesIds.push(savedFile.id);
      }
    }

    const photosIds = [];

    if (photos && photos.length) {
      for (const photo of photos) {
        const savedPhoto = await this.filesService.create(photo);
        // photosIds.push(savedPhoto.id);
      }
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

  async findOne(id: number, userId: number) {
    const vote = await this.repository.findOne({
      where: { id },
      relations: ['user', 'questions'],
    });

    const questions = [...vote.questions];

    for (const question of questions) {
      const answers = await this.answersService.findById(question.id);
      question.answers = [];

      for (const answer of answers) {
        const users = [];
        for (const userId of answer.users) {
          const user = await this.usersService.findById(userId);
          users.push({
            id: user.id,
            fullName: user.fullName,
            photo: user.photo,
          });
        }
        // @ts-ignore
        question.answers.push({
          id: answer.id,
          text: answer.text,
          count: answer.count,
          users,
        });
      }
    }

    vote.questions = [...questions];

    const isAdmin = userId === vote.user.id ? 'admin' : 'user';

    const users = [];
    for (const id of vote.usersVoted) {
      const user = await this.usersService.findById(id);
      users.push({
        id: user.id,
        fullName: user.fullName,
        photo: user.photo,
      });
    }

    const isVoted = vote.usersVoted.includes(userId);

    return { ...vote, isAdmin, isVoted, usersVoted: users };
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

  async voting(id: number, userId: number, userAnswers: {}) {
    await Object.values(userAnswers).forEach((value) => {
      if (Array.isArray(value)) {
        for (const answer of value) {
          this.answersService.voting(answer, userId);
        }
      } else {
        this.answersService.voting(value, userId);
      }
    });

    const vote = await this.repository.findOne({ where: { id } });
    vote.usersVoted.push(userId);

    await this.repository.save(vote);
    return;
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
      await this.repository.delete(id);
    } catch (error) {
      throw new ForbiddenException('Такого id не существует');
    }
  }
}
