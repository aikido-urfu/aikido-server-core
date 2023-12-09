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

  @Get(':id')
  @ApiResponse(GetVote)
  findOne(@Param('id') id: string) {
    // return this.votesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody(PostVote)
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(+id, updateVoteDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody(PatchVote)
  vote(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(+id, updateVoteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.votesService.remove(+id);
  }
}
