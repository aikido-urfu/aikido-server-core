import { Controller, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { GetKey, GetMe, GetUser, GetUsers, UpdateUser } from './types';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse(GetUsers)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/publicKey')
  @ApiResponse(GetKey)
  getKey() {
    return { key: process.env.RSA_PUBLIC_KEY };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse(GetMe)
  getMe(@UserId() id: number) {
    return this.usersService.findById(id);
  }

  @Get(':id')
  @ApiResponse(GetUser)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Patch('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBody(UpdateUser)
  update(@UserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/group/:groupId')
  // @UseGuards(JwtAuthGuard)
  updateGroup(@Param('id') id: string, @Param('groupId') groupId: string) {
    return this.usersService.changeGroup(+id, +groupId);
  }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
