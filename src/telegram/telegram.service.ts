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

@Injectable()
export class TelegramService {
  private headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + process.env.TG_AUTH_TOKEN,
  };
  private readonly tokens = new Map<string, number>();

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    @Inject(forwardRef(() => VotesService))
    private voteService: VotesService,
  ) {}

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

  async postDiscussionAnswer(
    voteName: string,
    userId: string,
    message: string,
  ) {
    try {
      const response = await fetch(Telegram_URL + 'discussion/answer', {
        method: 'POST',
        body: JSON.stringify({
          voteName: voteName,
          userId: userId,
          message: message,
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

  // Get votes, which will end in less than 24h, and become this in past 3 hours
  async getExpiringVotes(period: number) {
    try {
      period = Number(period);
      const expiringVotes = await this.voteService.getExpiring(period);

      const response = expiringVotes.map((vote) => {
        return {
          id: vote.id,
          title: vote.title,
          tgUserIds: vote.respondents.map((user) => user.telegramUserID),
          endDate: vote.endDate.toISOString(),
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
    // try {
    //   const userId = await this.usersService.findByTgid(tgid);
    //   const votes = await this.votesService.findCreatedByMe(userId);
    //   const response = [];
    //   for (const vote of votes) {
    //     response.push({
    //       text: vote.description,
    //       url: Frontend_URL + 'vote/' + vote.id,
    //     });
    //   }
    //   return response;
    // } catch (error) {
    //   throw new ForbiddenException(error);
    // }
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
      if (error instanceof ForbiddenException) {
        throw new ConflictException('No such user');
      } else {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    }
  }
}
