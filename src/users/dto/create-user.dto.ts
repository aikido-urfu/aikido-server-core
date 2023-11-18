import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'test@test.ru',
  })
  email: string;

  @ApiProperty({
    default: 'Vladislav',
  })
  fullName: string;

  @ApiProperty({
    default: '12345678',
  })
  password: string;
}
