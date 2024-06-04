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
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PostVote, GetVotes, GetVote, PatchVote } from './types';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('votes')
@ApiTags('votes')
@ApiBearerAuth()
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody(PostVote)
  create(@Body() createVoteDto: CreateVoteDto, @UserId() userId) {
    return this.votesService.create(createVoteDto, userId);
  }

  @Get()
  @ApiResponse(GetVotes)
  findAll() {
    return this.votesService.findAll();
  }

  // @Get()
  // @ApiResponse(GetVotes)
  // findMy() {
  //   return this.votesService.findMy();
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse(GetVote)
  findOne(@Param('id') id: string, @UserId() userId) {
    return this.votesService.findOne(+id, +userId);
  }

  @Get(':id/messages')
  @ApiResponse(GetVote)
  findMessages(@Param('id') id: string) {
    return this.votesService.getMessages(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody(PostVote)
  update(
    @Param('id') id: string,
    @UserId() userId,
    @Body() updateVoteDto: UpdateVoteDto,
  ) {
    return this.votesService.update(+id, userId, updateVoteDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody(PatchVote)
  vote(
    @Param('id') id: string,
    @UserId() userId,
    @Body() userAnswers: { kek: number[] },
  ) {
    return this.votesService.voting(+id, +userId, userAnswers);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserId() userId: number) {
    return this.votesService.remove(+id, userId);
  }
}
