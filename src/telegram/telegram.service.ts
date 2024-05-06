import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { UsersService } from 'src/users/users.service';
import { Frontend_URL, Telegram_URL } from 'API_URL';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Repository } from 'typeorm';
import { Vote } from 'src/votes/entities/vote.entity';

@Injectable()
export class TelegramService {
  private headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + process.env.TG_AUTH_TOKEN,
  };

  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @InjectRepository(Vote)
    private usersService: UsersService,
  ) {}

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
      console.log(error.message);
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
      console.log(error.message);
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
      console.log(error.message);
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
      console.log(error.message);
    }
  }

  create(createTelegramDto: CreateTelegramDto) {
    return 'This action adds a new telegram';
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

  remove(id: number) {
    return `This action removes a #${id} telegram`;
  }
}
