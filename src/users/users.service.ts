import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const maxId = await this.repository
      .createQueryBuilder('users')
      .select('MAX(users.id)', 'maxId')
      .getRawOne();

    const newId = maxId.maxId + 1;

    const newUser = {
      id: newId,
      ...createUserDto,
    };

    await this.repository.save(newUser);

    return { id: newId };
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({
      email,
    });
  }

  async findById(id: number) {
    return this.repository.findOneBy({
      id,
    });
  }

  async findByJWT(id) {
    return this.repository.getId;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return { id };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
