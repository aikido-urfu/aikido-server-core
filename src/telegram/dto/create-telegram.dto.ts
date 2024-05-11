import { ApiProperty } from '@nestjs/swagger';

export class CreateTelegramDto {
  @ApiProperty({
    type: 'string',
  })
  telegramUserID: string;
  @ApiProperty({
    type: 'string',
  })
  token: string;
}
