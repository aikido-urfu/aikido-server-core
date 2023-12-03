import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByRegister({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!email || !password || !fullName || user) {
      return false;
    }

    return true;
  }

  async register(dto: CreateUserDto) {
    try {
      if (!(await this.validateUserByRegister(dto))) {
        throw new BadRequestException('Отсуствуют необходимые поля');
      }
      const userData = await this.usersService.create(dto);

      return {
        token: this.jwtService.sign({ id: userData.id }),
      };
    } catch (error) {
      console.log(error);

      throw new ForbiddenException(error || 'Ошибка при регистрации');
    }
  }

  async validateUserByLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(dto: LoginUserDto) {
    if (!(await this.validateUserByLogin(dto))) {
      throw new BadRequestException('Не правильные логин или пароль');
    }
    const { id } = await this.usersService.findByEmail(dto.email);

    return {
      token: this.jwtService.sign({ id }),
    };
  }
}
