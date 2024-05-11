import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Vote } from 'src/votes/entities/vote.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private repository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto, userId: number) {
    if (createMessageDto.isRef) {
      if (!this.repository.findOne({
        where: {
          id: createMessageDto.refComId
        }
      })) {
        throw new NotFoundException("Комментарий, на который Вы ссылаетесь, не найден");
      }
    }
    
    try {
      const message = {
        text: createMessageDto.text,
        vote: createMessageDto.voteId as DeepPartial<Vote>,
        userId: userId,
        isRef: createMessageDto.isRef,
        refComId: createMessageDto.isRef ? createMessageDto.refComId : null,
      }

      console.log(message);

      const newMessage = await this.repository.create(message);
      await this.repository.save(newMessage);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  async findOne(id: number) {
    const message = this.repository.findOne({
      where: {
        id: id,
      }
    });
    
    if (!message) {
      throw new NotFoundException("Комментарий не найден");
    }

    return message
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
