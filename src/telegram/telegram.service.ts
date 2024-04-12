import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTelegramDto } from './dto/create-telegram.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { UsersService } from 'src/users/users.service';
import { VotesService } from 'src/votes/votes.service';
import { Frontend_URL } from 'API_URL';

@Injectable()
export class TelegramService {
  constructor(
    private usersService: UsersService,
    private votesService: VotesService,
  ) {}
  create(createTelegramDto: CreateTelegramDto) {
    return 'This action adds a new telegram';
  }

  async findAll(tgid: string) {
    try {
      const userId = await this.usersService.findByTgid(tgid);
      const votes = await this.votesService.findCreatedByMe(userId);
      const response = [];

      for (const vote of votes) {
        response.push({
          text: vote.description,
          url: Frontend_URL + 'vote/' + vote.id,
        });
      }

      return response;
    } catch (error) {
      throw new ForbiddenException(error);
    }
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
