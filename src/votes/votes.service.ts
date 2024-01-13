import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { User } from 'src/users/entities/user.entity';
import { AnswersService } from 'src/answers/answers.service';
import { UsersService } from 'src/users/users.service';
import { saveFile } from 'src/tools/saveFile';
import { FilesService } from 'src/files/files.service';

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
    try {
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

      const newVote = await this.repository.create(voteData);
      await this.repository.save(newVote);
      await this.questionsService.save(questions, newVote.id);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findAll() {
    try {
      const votes = await this.repository.find({
        relations: ['user'],
      });

      const result = [];

      for (const el of votes) {
        const photos = [];

        for (const photo of el.photos) {
          const getPhoto = await this.filesService.getById(photo);
          photos.push(getPhoto);
        }
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
          photos,
        });
      }

      return { votes: result };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findMy(userId: number) {
    try {
      const votes = await this.repository.find({
        where: {
          user: { id: userId },
        },
        relations: ['user'], // Загрузка информации пользователя вместе с голосами, если это требуется
      });

      return votes;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const vote = await this.repository.findOne({
        where: { id },
        relations: ['user', 'questions'],
      });

      const author = {
        id: vote.user.id,
        email: vote.user.email,
        fullName: vote.user.fullName,
        phone: vote.user.phone,
        photo: vote.user.photo,
        telegram: vote.user.telegram,
      };

      const questions = [...vote.questions];

      for (const question of questions) {
        const photos = [];
        const files = [];

        for (const photo of question.photos) {
          photos.push(await this.filesService.getById(photo));
        }

        for (const file of question.files) {
          files.push(await this.filesService.getById(file));
        }

        question.files = files;
        question.photos = photos;

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
          email: user.emaiL,
        });
      }

      const isVoted = vote.usersVoted.includes(userId);

      const photosIds = [];
      const filesIds = [];

      for (const photo of vote.photos) {
        photosIds.push(await this.filesService.getById(photo));
      }

      for (const file of vote.files) {
        filesIds.push(await this.filesService.getById(file));
      }

      return {
        ...vote,
        isAdmin,
        isVoted,
        usersVoted: users,
        photos: photosIds,
        files: filesIds,
        user: author,
      };
    } catch (error) {
      throw new ForbiddenException(error);
    }
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

    try {
      const oldVote = await this.repository.findOneBy({ id });
      const newVote = { ...oldVote, ...voteData };

      await this.repository.save(newVote);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async voting(id: number, userId: number, userAnswers: {}) {
    try {
      const vote = await this.repository.findOne({
        where: { id },
        relations: ['questions'],
      });

      for (const answer of Object.values(userAnswers)) {
        await this.answersService.unvoting(answer, userId);
        await this.answersService.voting(answer, userId);
      }

      if (!Array.isArray(vote.usersVoted)) {
        vote.usersVoted = [];
      }

      vote.usersVoted.push(userId);

      this.repository.save(vote);
    } catch (error) {
      return new ForbiddenException(error);
    }
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
