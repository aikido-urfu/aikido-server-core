import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
  })
  email: string;

  @ApiProperty({
    type: 'string',
  })
  fullName: string;

  @ApiProperty({
    type: 'string',
  })
  role: string;

  @ApiProperty({
    type: 'string',
  })
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    type: 'string',
  })
  email: string;

  @ApiProperty({
    type: 'string',
  })
  password: string;
}
