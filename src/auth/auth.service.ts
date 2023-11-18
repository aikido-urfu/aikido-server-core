import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      const userData = await this.usersService.create(dto);

      return {
        token: this.jwtService.sign({ id: userData.id }),
      };
    } catch (error) {
      console.log(error);

      throw new ForbiddenException('Ошибка при регистрации');
    }
  }

  async login(user: User) {
    return {
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
