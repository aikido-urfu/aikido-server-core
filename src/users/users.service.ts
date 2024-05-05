import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { saveFile } from 'src/tools/saveFile';
import { NotFoundError } from 'rxjs';
import { GroupsService } from '../groups/groups.service';
import { Group } from 'src/groups/entities/group.entity';
import { roles } from 'src/tools/roles';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    // private groupsService: GroupsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = {
      email: createUserDto.email,
      fullName: createUserDto.fullName,
      password: createUserDto.password,
      role: roles.athlete,
    };

    try {
      createdUser.role = this.changeRole(createUserDto.role);

      const newUser = await this.repository.create(createdUser);
      await this.repository.save(newUser);
      return { id: newUser.id };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  changeRole(role: string) {
    if (role) {
      switch (role.toLowerCase()) {
        case 'athlete':
        case 'спортсмен':
          return roles.athlete;

        case 'parent':
        case 'родитель':
          return roles.parent;

        case 'trainer':
        case 'тренер':
          return roles.trainer;

        case 'club_head':
        case 'руководитель клуба':
          return roles.club_head;

        case 'federation_head':
        case 'руководитель федерации':
          return roles.federation_head;

        case 'admin':
        case 'админ':
          return roles.admin;

        default:
          throw new ForbiddenException('Такой роли нет');
      }
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
        role: user.role,
        photo: user.photo,
        phone: user.phone,
        emaiL: user.email,
        telegramUserID: user.telegramUserID,
      };

      return response;
    } catch (error) {
      throw new NotFoundException(error);
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
          role: user.role,
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

  async findMyVotes(id: number) {
    try {
      const user = await this.repository.findOne({
        where: {id},
        relations: ['assigned']
      });

      // const result = [];

      // for (let vote of user.assigned) {
      //   result.push(this.votesService.findOne(vote.id, id));
      // }

      // return result;
      return user.assigned;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const oldVote = await this.repository.findOneBy({ id });

      if (updateUserDto.role) {
        delete updateUserDto.role;
      }
      const newRole = 0;

      const newVote = await {
        ...oldVote,
        ...updateUserDto,
        role: newRole,
      };

      await this.repository.save(newVote);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async changeGroup(userId: number, groupId: number) {
    try {
      const user = await this.repository.findOneBy({
        id: userId,
      });

      const newGroup = { group: groupId as DeepPartial<Group> };
      const newUser = { ...user, ...newGroup };
      await this.repository.save(newUser);
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
