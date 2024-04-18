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

  async findAllWithoutUsers() {
    try {
      const groups = await this.repository.find({
        relations: ['users']
      });
      
      const response = [];

      for (const group of groups) {
        await response.push({
          id: group.id,
          name: group.name,
        });
      }
      return { groups: response };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
