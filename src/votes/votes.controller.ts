import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('votes')
@ApiTags('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
      },
    },
  })
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        votes: {
          type: 'array',
          properties: {
            title: {
              type: 'string',
            },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.votesService.findAll();
  }

  @Get(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        title: {
          type: 'string',
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(+id, updateVoteDto);
  }

  @Delete(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        title: {
          type: 'string',
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.votesService.remove(+id);
  }
}
