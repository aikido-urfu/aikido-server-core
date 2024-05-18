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
      } else {
        const mesRef = this.repository.findOne({
          where: {
            id: createMessageDto.refComId
          },
          relations: ['vote']
        });
        if ((await mesRef).vote.id != createMessageDto.voteId) {
          throw new ForbiddenException("Комментарий, на который Вы ссылаетесь, принадлежит другому обсуждению");
        }
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

      const newMessage = await this.repository.create(message);
      await this.repository.save(newMessage);
      
      if (newMessage.isRef) {
        const referenced = await this.repository.findOneBy({
            id: newMessage.refComId
          });
        try {
          let refRefs = referenced.references;
          refRefs.push(+newMessage.id);
          await this.repository.save({...referenced, references: refRefs});
        } catch (error) {
          throw new ForbiddenException(error);
        }
      }
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
