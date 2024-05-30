import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GroupsService } from '../groups/groups.service';
import { Group } from 'src/groups/entities/group.entity';
import { roles } from 'src/tools/roles';
import { FilesService } from 'src/files/files.service';

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
      role: 'athlete',
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
          return 'athlete';

        case 'parent':
        case 'родитель':
          return 'parent';

        case 'trainer':
        case 'тренер':
          return 'trainer';

        case 'club_head':
        case 'руководитель клуба':
          return 'club_head';

        case 'federation_head':
        case 'руководитель федерации':
          return 'federation_head';

        case 'admin':
        case 'админ':
          return 'admin';

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
        where: { id },
        relations: ['assigned'],
      });

      const result = [];
      const now = new Date();
      
      for (let vote of user.assigned) {
        const isActive = vote.endDate > now && now > vote.startDate;
        const isVoted = Boolean(vote.usersVoted.find((x) => x == id));
        result.push({...vote, isActive, isVoted})
      }

      return { votes: result.reverse() };
      // return { votes: user.assigned.reverse };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const oldUser = await this.repository.findOneBy({ id });

      if (updateUserDto.role) {
        delete updateUserDto.role;
      }
      const newRole = 'athlete';

      const newUser = await {
        ...oldUser,
        ...updateUserDto,
        role: newRole,
      };

      if (JSON.stringify(newUser) === JSON.stringify(oldUser)) {
        throw new ConflictException('Nothing has been changed');
      }

      await this.repository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      else throw new ForbiddenException(error);
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
