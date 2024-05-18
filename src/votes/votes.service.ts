import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeepPartial,
  Repository,
  LessThan,
  MoreThanOrEqual,
  And,
  IsNull,
  Not,
} from 'typeorm';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { User } from 'src/users/entities/user.entity';
import { AnswersService } from 'src/answers/answers.service';
import { UsersService } from 'src/users/users.service';
import { saveFile } from 'src/tools/saveFile';
import { FilesService } from 'src/files/files.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { MessagesService } from '../messages/messages.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Message } from '../messages/entities/message.entity';
import { roles } from '../tools/roles';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private repository: Repository<Vote>,
    @Inject(forwardRef(() => TelegramService))
    private telegramService: TelegramService,
    private usersService: UsersService,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private filesService: FilesService,
    private messagesService: MessagesService,
  ) {}

  async create(createVoteDto: CreateVoteDto, userId: number) {
    try {
      const {
        title,
        isAnonymous,
        isHidenCount,
        questions,
        description,
        startDate,
        endDate,
        respondents,
        files,
        photos,
      } = createVoteDto;

      if (!userId || !title || !questions || !questions.length) {
        throw new ForbiddenException('Отсутсвуют необходимые поля');
      }

      let usersResp = [];

      for (let id of respondents) {
        let foundUser = await this.usersService.findById(id);
        // let foundUser = id as DeepPartial<User>;
        if (roles[(await this.usersService.findById(userId)).role] < roles[foundUser.role]) {
          throw new ForbiddenException(
            `Недостаточно прав для добавлениия пользователя ${foundUser.fullName}`,
          );
        }
        usersResp.push(foundUser);
      }

      // console.log(userId as DeepPartial<User>);
      // console.log(respondents as DeepPartial<User>[]);

      const voteData = {
        creator: userId as DeepPartial<User>,
        title,
        description,
        startDate: startDate ? new Date(startDate) : startDate,
        endDate: endDate ? new Date(endDate) : endDate,
        creationDate: new Date(),
        isAnonymous: isAnonymous ?? true,
        isHidenCount: isHidenCount ?? false,
        respondents: usersResp,
        files,
        photos,
      };
      console.log(voteData.creator);

      const startDateNew = voteData.startDate;
      const endDateNew = voteData.endDate;

      if (
        !startDateNew ||
        !endDateNew ||
        startDateNew >= endDateNew ||
        voteData.creationDate > endDateNew ||
        voteData.creationDate > startDateNew
      ) {
        throw new ForbiddenException(
          'Неверно указаны даты конца и начала голосования',
        );
      }

      const newVote = await this.repository.create(voteData);
      await this.repository.save(newVote);
      await this.questionsService.save(questions, newVote.id);
      await this.telegramService.postNewVote(newVote);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findAll() {
    try {
      const votes = await this.repository.find({
        relations: ['creator'],
      });

      const result = [];

      for (const el of votes) {
        result.unshift({
          id: el.id,
          title: el.title,
          description: el.description,
          startDate: el.startDate,
          endDate: el.endDate,
          creationDate: el.creationDate,
          isAnonymous: el.isAnonymous,
          respondents: el.respondents,
          photos: el.photos,
        });
      }

      return { votes: result };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  // async findMy(userId: number) {
  //   try {
  //     const votes = await this.repository.find({
  //       where: {
  //         creator: { id: userId },
  //       },
  //       relations: ['user'], // Загрузка информации пользователя вместе с голосами, если это требуется
  //     });

  //     return votes;
  //   } catch (error) {
  //     throw new ForbiddenException(error);
  //   }
  // }

  async findCreatedByMe(userId: number) {
    try {
      const votes = await this.repository.find({
        where: {
          creator: { id: userId },
        },
        relations: ['creator'], // Загрузка информации пользователя вместе с голосами, если это требуется
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
        relations: ['creator', 'questions', 'respondents'],
      });

      const voteFiles = [];
      for (const voteFile of vote.files) {
        const getFile = await this.filesService.getById(voteFile);
        await voteFiles.push(getFile);
      }

      const author = {
        id: vote.creator.id,
        email: vote.creator.email,
        fullName: vote.creator.fullName,
        phone: vote.creator.phone,
        photo: vote.creator.photo,
      };

      const questions = [...vote.questions];

      for (const question of questions) {
        const questionFiles = [];
        for (const questionFile of question.files) {
          const getFile = await this.filesService.getById(questionFile);
          await questionFiles.push(getFile);
        }
        question.files = await questionFiles;
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

      const isAdmin = userId === vote.creator.id ? 'admin' : 'user';

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

      return {
        ...vote,
        files: voteFiles,
        isAdmin,
        isVoted,
        usersVoted: users,
        user: author,
      };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async getMessages(id: number) {
    let vote = await this.repository.findOne({
      where: { id },
      relations: ['creator', 'messages'],
    });

    if (!vote) {
      throw new NotFoundException('Обсуждение не найдено');
    }

    let result = [];

    let messages = vote.messages;
    let rootMessages = vote.messages.filter((x) => x.isRef == false);

    try {
      for (let message of rootMessages) {
        result.push(await formMessageRecursive(message, this.usersService, this.messagesService));
      }

      return { messages: result };
    } catch (error) {
      throw new ForbiddenException(error);
    }

    async function formMessageRecursive(message: Message, us: UsersService, ms: MessagesService) {
      let refUser;

      if (message.isRef) {
        refUser = await us.findById((await ms.findOne(message.refComId)).userId);
      }

      let references = [];

      if (message.references.length > 0) {
        for (const id of message.references) {
          references.push(await formMessageRecursive(messages.find((m) => m.id == id), us, ms));
        }
      }

      let newMes = {
        id: message.id,
        text: message.text,
        creationDate: message.creationDate,
        userId: message.userId,
        userName: (await us.findById(message.userId)).fullName,
        isRef: message.isRef,
        refComId: message.isRef ? message.refComId : null,
        refUserId: message.isRef ? refUser.id : null,
        refUserName: message.isRef ? refUser.fullName : null,
        references: references,
      };

      return newMes;
    }
  }

  // expired = endDate >= (cur - 3h) && endDate < (cur)
  // period in seconds (10800 = 3h)
  async getExpired(period: number = 10800) {
    try {
      if (!period) {
        period = 10800;
      }
      const currentDate = new Date();
      const startTime = new Date(currentDate.getTime() - period * 1000);
      const votes = await this.repository.find({
        relations: ['respondents'],
        where: {
          endDate: And(MoreThanOrEqual(startTime), LessThan(currentDate)),
          respondents: {
            telegramUserID: Not(IsNull()),
          },
        },
      });

      return votes;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  // expiring = endDate >= (cur + 24h - 3h) && endDate < (cur + 24h)
  async getExpiring(period: number = 10800) {
    try {
      if (!period) {
        period = 10800;
      }
      const day = 86400; // 24h
      const currentDate = new Date();
      const startTime = new Date(currentDate.getTime() + (day - period) * 1000);
      const endTime = new Date(currentDate.getTime() + day * 1000);
      const votes = await this.repository.find({
        relations: ['respondents'],
        where: {
          endDate: And(MoreThanOrEqual(startTime), LessThan(endTime)),
          respondents: {
            telegramUserID: Not(IsNull()),
          },
        },
      });

      return votes;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(id: number, updateVoteDto: UpdateVoteDto) {
    const {
      title,
      isAnonymous,
      isHidenCount,
      questions,
      description,
      startDate,
      endDate,
      respondents,
      files,
      photos,
    } = updateVoteDto;

    if (!id || !title || !questions || !questions.length) {
      throw new ForbiddenException('Отсутсвуют необходимые поля');
    }

    let usersResp = [];

    for (let id of respondents) {
      usersResp.push(id as DeepPartial<User>);
    }

    const voteData = {
      title,
      description,
      startDate,
      endDate,
      isAnonymous: isAnonymous ?? true,
      isHidenCount: isHidenCount ?? false,
      respondents: usersResp,
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

  async voting(id: number, userId: number, userAnswers: { kek: number[] }) {
    try {
      const vote = await this.repository.findOne({
        where: { id },
        relations: ['questions', 'respondents'],
      });

      const now = new Date();

      if (vote.endDate && vote.startDate) {
        if (vote.endDate < now) {
          throw new ForbiddenException('Время на голосование истекло');
        } else if (now < vote.startDate) {
          throw new ForbiddenException('Голосование не началось');
        }
      }

      const me = vote.respondents.find((user) => user.id == userId);

      if (!me) {
        throw new ForbiddenException('Вы не учавствуете в голосовании');
      }

      for (const questionAnswers of Object.values(userAnswers)) {
        for (const answer of questionAnswers) {
          await this.answersService.unvoting(answer, userId);
          await this.answersService.voting(answer, userId);
        }
      }

      if (!Array.isArray(vote.usersVoted)) {
        vote.usersVoted = [];
      }

      vote.usersVoted.push(userId);

      this.repository.save(vote);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const vote = await this.repository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (Number(vote.creator.id) !== userId) {
        throw new ForbiddenException('Недостаточно прав');
      }

      await this.questionsService.delete(id);
      await this.repository.delete(id);
    } catch (error) {
      throw new ForbiddenException('Такого id не существует');
    }
  }
}
