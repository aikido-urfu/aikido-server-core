import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './../auth/auth.service';
import { Telegram_URL } from 'API_URL';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Repository } from 'typeorm';
import { Vote } from 'src/votes/entities/vote.entity';
import { createHash, randomBytes } from 'crypto';
import { VotesService } from 'src/votes/votes.service';
import { GetExpiredVotes } from './types';
import { Message } from 'src/messages/entities/message.entity';

@Injectable()
export class TelegramService {
  private headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + process.env.TG_AUTH_TOKEN, // TODO: Create proper authorization
  };
  private readonly tokens = new Map<string, number>();

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    @Inject(forwardRef(() => VotesService))
    private voteService: VotesService,
  ) {}

  // TODO: Create token expiration (via new Token service?)
  generateToken(userId: number): string {
    const token = randomBytes(16).toString('hex');
    this.tokens.set(token, userId);
    return token;
  }

  getUserIdByToken(token: string): number | undefined {
    return this.tokens.get(token);
  }

  // TODO: В случае провала рассылки запустить таймер на повторную попытку через время.
  async postNewVote(vote: Vote) {
    try {
      const tgUserIds = vote.respondents.reduce(function (result, val) {
        if (val.telegramUserID) {
          result.push(val.telegramUserID);
        }
        return result;
      }, []);

      if (tgUserIds.length == 0) {
        console.log('No tg users to notify');
        return;
      }

      const response = await fetch(Telegram_URL + 'votes/new', {
        method: 'POST',
        body: JSON.stringify({
          id: vote.id,
          title: vote.title,
          startDate: vote.startDate.toISOString(),
          endDate: vote.endDate.toISOString(),
          tgUserIds: tgUserIds,
        }),
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(
          'Error during post message to tg bot: postNewVote - ' +
            response.statusText,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async postDiscussionAnswer(refMessage: Message, referencedComment: Message) {
    try {
      const user = await this.usersService.findById(referencedComment.userId);
      const tgUserIds = user.telegramUserID;

      // if (user.id == refMessage.userId) {
      //   // console.log('Answer from messageAuthor');
      //   return;
      // }

      if (!tgUserIds) {
        console.log('No tg users to notify');
        return;
      }

      const response = await fetch(Telegram_URL + 'discussion/answer', {
        method: 'POST',
        body: JSON.stringify({
          id: referencedComment.vote.id,
          title: referencedComment.vote.title,
          tgUserIds: [tgUserIds],
          // message: refMessage.text,
          // messageAuthor: refMessage.userId, // TODO: Get userName
          // messageDate: refMessage.creationDate.toISOString, // TODO: TZ related
        }),
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(
          'Error during post message to tg bot: postDiscussionAnswer - ' +
            response.statusText,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async postVoteReminder(vote: Vote) {
    try {
      const tgUserIds = vote.respondents.reduce(function (result, user) {
        if (user.telegramUserID && !vote.usersVoted.includes(user.id)) {
          result.push(user.telegramUserID);
        }
        return result;
      }, []);

      if (tgUserIds.length == 0) {
        console.log('No tg users to notify');
        return;
      }

      const response = await fetch(Telegram_URL + 'votes/reminder', {
        method: 'POST',
        body: JSON.stringify({
          id: vote.id,
          title: vote.title,
          voteEndDate: vote.endDate.toISOString(),
          tgUserIds: tgUserIds,
        }),
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(
          'Error during post message to tg bot: postVoteReminder - ' +
            response.statusText,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async postVoteResults(vote: Vote, results: Object) {
    try {
      const tgUserIds = vote.respondents.reduce(function (result, val) {
        if (val.telegramUserID) {
          result.push(val.telegramUserID);
        }
        return result;
      }, []);

      if (tgUserIds.length == 0) {
        console.log('No tg users to notify');
        return;
      }

      const response = await fetch(Telegram_URL + 'votes/reminder', {
        method: 'POST',
        body: JSON.stringify({
          id: vote.id,
          title: vote.title,
          tgUserIds: tgUserIds,
          results: results,
        }),
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(
          'Error during post message to tg bot: postVoteResults - ' +
            response.statusText,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getToken(userId: number) {
    return { token: this.generateToken(userId) };
  }

  async getExpiredVotes(period: number) {
    try {
      period = Number(period);
      const expiredVotes = await this.voteService.getExpired(period);

      const response = expiredVotes.map((vote) => {
        return {
          id: vote.id,
          title: vote.title,
          tgUserIds: vote.respondents.map((user) => user.telegramUserID),
        };
      });

      return { votes: response };
    } catch (error) {
      if (error! instanceof InternalServerErrorException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  // TODO: https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
  // TODO: https://stackoverflow.com/questions/1091372/getting-the-clients-time-zone-and-offset-in-javascript
  // TODO: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  // Get votes, which will end in less than 24h, and become this in past 3 hours
  async getExpiringVotes(period: number) {
    try {
      period = Number(period);
      const expiringVotes = await this.voteService.getExpiring(period);

      const userTimeZone = 5 * 60; // TODO: Store and get TimeZone offset in minutes from user table
      const response = expiringVotes.map((vote) => {
        return {
          id: vote.id,
          title: vote.title,
          tgUserIds: vote.respondents.reduce(function (result, user) {
            if (!vote.usersVoted.includes(user.id)) {
              result.push(user.telegramUserID);
            }
            return result;
          }, []),
          endDate: new Date(
            vote.endDate.getTime() + userTimeZone * 60 * 1000,
          ).toISOString(),
        };
      });

      return { votes: response };
    } catch (error) {
      if (error! instanceof InternalServerErrorException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  async create(createTelegramDto: CreateTelegramDto) {
    try {
      const userId = this.getUserIdByToken(createTelegramDto.token);
      if (!userId) {
        throw new BadRequestException();
      }

      await this.usersService.update(userId, {
        telegramUserID: createTelegramDto.telegramUserID,
      });

      return `Telegram linked for ${userId} user id`;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAll(tgid: string) {
    try {
      if (!tgid) {
        throw new BadRequestException();
      }
      const userId = await this.usersService.findByTgid(tgid);
      const res = await this.usersService.findMyVotes(userId);

      const response = res.votes.map((vote) => {
        return {
          id: vote.id,
          title: vote.title,
          startDate: vote.startDate.toISOString(),
          endDate: vote.endDate.toISOString(),
          isVoted: vote.isVoted,
          isExpired: new Date().getTime() - vote.endDate.getTime() > 0,
        };
      });

      return { votes: response };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} telegram`;
  }

  update(id: number, updateTelegramDto: UpdateTelegramDto) {
    return `This action updates a #${id} telegram`;
  }

  async remove(id: string) {
    try {
      const userId = await this.usersService.findByTgid(id);

      await this.usersService.update(userId, {
        telegramUserID: null,
      });

      return `Telegram unlinked for ${userId} user id`;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    }
  }
}
