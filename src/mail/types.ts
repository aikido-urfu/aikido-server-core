import { ApiProperty } from '@nestjs/swagger';

export const PostMail = {
  schema: {
    type: 'object',
    properties: {
      theme: {
        type: 'string',
      },
      receivers: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
      text: {
        type: 'string',
      },
      files: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      photos: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};

export class ReceiverDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class FileDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;
}

export class MailDto {
  @ApiProperty()
  isReaden: boolean;

  @ApiProperty()
  date: string;

  @ApiProperty()
  theme: string;

  @ApiProperty({ type: [ReceiverDto] })
  recievers: ReceiverDto[];

  @ApiProperty()
  text: string;

  @ApiProperty({ type: [FileDto] })
  files: FileDto[];

  @ApiProperty({ type: [String] })
  photos: string[];
}

export class PostMailDto {
  @ApiProperty()
  theme: string;

  @ApiProperty({ type: [Number] })
  receivers: number[];

  @ApiProperty()
  text: string;

  @ApiProperty({ type: [String] })
  files: string[];

  @ApiProperty({ type: [String] })
  photos: string[];
}

export class GetMailDto {
  @ApiProperty({ type: [MailDto] })
  mails: MailDto[];
}
