import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';

const userProfile = {
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      login: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },
    },
  },
};

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiConsumes('multipart/form-data')
  @ApiResponse(userProfile)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  })
  @ApiResponse(userProfile)
  getMe(@UserId() id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody(userProfile)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
