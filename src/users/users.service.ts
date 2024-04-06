import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { saveFile } from 'src/tools/saveFile';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.repository.create(createUserDto);
      newUser.role = "user";
      await this.repository.save(newUser);
      return { id: newUser.id };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findByEmail(email: string) {
    try {
      return this.repository.findOneBy({
        email,
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findById(id: number) {
    try {
      const user = await this.repository.findOneBy({
        id,
      });

      const response = {
        id: user.id,
        fullName: user.fullName,
        group: user.group,
        photo: user.photo,
        phone: user.phone,
        emaiL: user.email
      };

      return response;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findByTgid(telegramUserID: string) {
    try {
      const user = await this.repository.findOneBy({
        telegramUserID,
      });

      return user.id;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findByJWT(id) {
    return this.repository.getId;
  }

  async findAll() {
    try {
      const users = await this.repository.find();
      const response = [];

      for (const user of users) {
        await response.push({
          id: user.id,
          fullName: user.fullName,
          group: user.group,
          photo: user.photo,
          phone: user.phone,
          email: user.email,
        });
      }

      return response;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  findOne(id: number) {
    return { id };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const oldVote = await this.repository.findOneBy({ id });

      const newVote = await {
        ...oldVote,
        ...updateUserDto,
      };

      await this.repository.save(newVote);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
