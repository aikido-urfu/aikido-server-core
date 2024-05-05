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
import { Repository } from 'typeorm';

@Injectable()
export class TelegramService {
  private headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + process.env.TG_AUTH_TOKEN,
  };

  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private usersService: UsersService,
  ) {}

  async postNewVote(
    voteName: string,
    voteStartDate: Date,
    voteEndDate: Date,
    userIds: Array<User>,
  ) {
    try {
      const tgUserIds: Array<string> = userIds.map((val) => val.telegramUserID);

      if (!tgUserIds) {
        console.log('No tg users for notify');
        return;
      }

      const response = await fetch(Telegram_URL + '/votes/new', {
        method: 'POST',
        body: JSON.stringify({
          voteName: voteName,
          voteStartDate: voteStartDate.toISOString(),
          voteEndDate: voteEndDate.toISOString(),
          userIds: tgUserIds,
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
      const response = await fetch(Telegram_URL + '/discussion/answer', {
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

  async postVoteReminder(voteName: string, userId: string, voteEndDate: Date) {
    try {
      const response = await fetch(Telegram_URL + '/votes/reminder', {
        method: 'POST',
        body: JSON.stringify({
          voteName: voteName,
          userId: userId,
          voteEndDate: voteEndDate.toISOString(),
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
