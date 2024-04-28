import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private repository: Repository<Group>,
    // private usersService: UsersService,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    try {
      const newGroup = await this.repository.create(createGroupDto);
      await this.repository.save(newGroup);
      return { id: newGroup.id };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findAll() {
    try {
      const groups = await this.repository.find({
        relations: ['users'],
      });

      const response = [];

      for (const group of groups) {
        response.push({
          id: group.id,
          name: group.name,
          users: group.users,
        });
      }
      return { groups: response };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne(id: number) {
    try {
      const group = await this.repository.findOne({
        where: { id },
        relations: ['users'],
      });

      const response = [];

      response.push({
        id: group.id,
        name: group.name,
        users: group.users,
      });

      return { groups: response };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  async remove(id: number) {
    try {
      await this.repository.delete(id);
      return;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
