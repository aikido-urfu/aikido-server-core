import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Patch,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PostVote, GetVotes, GetVote, PatchVote } from './types';
import { UserId } from 'src/decorators/user-id.decorator';
import multer, { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'src/files/storage';

@Controller('votes')
@ApiTags('votes')
@ApiBearerAuth()
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody(PostVote)
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createVoteDto: CreateVoteDto,
    @UserId() userId,
    @UploadedFile() files: Array<Multer.File>,
  ) {
    return this.votesService.create(createVoteDto, userId);
  }

  @Get()
  @ApiResponse(GetVotes)
  findAll() {
    return this.votesService.findAll();
  }

  @Get(':id')
  @ApiResponse(GetVote)
  findOne(@Param('id') id: string, @UserId() userId) {
    return this.votesService.findOne(+id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody(PostVote)
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(+id, updateVoteDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody(PatchVote)
  vote(@Param('id') id: string, @UserId() userId, @Body() userAnswers: {}) {
    return this.votesService.voting(+id, userId, userAnswers);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserId() userId: number) {
    return this.votesService.remove(+id, userId);
  }
}
