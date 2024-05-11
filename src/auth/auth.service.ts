import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RsaService } from 'src/tools/RSA';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private rsaService: RsaService;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.rsaService = new RsaService();
  }

  async validateUserByRegister({
    email,
    password,
    fullName,
    role,
  }: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!email || !password || !fullName || /*!role ||*/ user) {
      return false;
    }

    return true;
  }

  async register(dto: CreateUserDto) {
    try {
      if (!(await this.validateUserByRegister(dto))) {
        throw new BadRequestException('Некорректно заполнены поля');
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

    if (
      user &&
      this.rsaService.encrypt(user.password) ===
        this.rsaService.encrypt(password)
    ) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(dto: LoginUserDto) {
    if (!(await this.validateUserByLogin(dto))) {
      throw new BadRequestException('Неправильные логин или пароль');
    }
    const { id } = await this.usersService.findByEmail(dto.email);

    return {
      token: this.jwtService.sign({ id }),
    };
  }

  async findByJWT(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);
      // const decodedToken = this.jwtService.verify(token, { maxAge: '1h' });
      const userId = decodedToken.id;
      return userId;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // async getToken(userId: number) {
  //   try {
  //     return this.jwtService.sign(
  //       { id: userId },
  //       {
  //         expiresIn: '1h',
  //         secret: process.env.TG_SECRET_KEY,
  //         allowInsecureKeySizes: true,
  //         algorithm: 'HS256',
  //       },
  //     );
  //   } catch (error) {
  //     throw new BadRequestException(`No such user with ${userId} id`);
  //   }
  // }

  // async getByTgToken(token: string) {
  //   // Дешифруем токен
  //   try {
  //     const decodedToken = this.jwtService.verify(token, {
  //       secret: process.env.TG_SECRET_KEY,
  //     }) as {
  //       id: string;
  //     };
  //     return decodedToken.id; // Возвращаем идентификатор пользователя
  //   } catch (error) {
  //     return null; // Если токен недействителен, возвращаем null
  //   }
  // }
}
