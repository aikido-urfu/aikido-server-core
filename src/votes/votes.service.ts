import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private repository: Repository<Vote>,
    private questionsService: QuestionsService,
  ) {}

  async create(createVoteDto: CreateVoteDto, userId: number) {
    const {
      title,
      isAnonymous,
      isHidenCount,
      isPrivate,
      questions,
      description,
      isActive,
      dateOfStart,
      dateOfEnd,
      privateUsers,
      files,
      photos,
    } = createVoteDto;

    if (!userId || !title || !questions || !questions.length) {
      throw new ForbiddenException('Отсутсвуют необходимые поля');
    }

    const maxId = await this.repository
      .createQueryBuilder('votes')
      .select('MAX(votes.id)', 'maxId')
      .getRawOne();

    const voteData = {
      id: maxId + 1,
      user: userId as DeepPartial<User>,
      title,
      description,
      isActive: isActive ?? true,
      dateOfStart,
      dateOfEnd,
      creationDate: Date.now() + '',
      isPrivate: isPrivate ?? false,
      isAnonymous: isAnonymous ?? true,
      isHidenCount: isHidenCount ?? false,
      privateUsers,
      files,
      photos,
    };

    this.questionsService.save(questions, maxId + 1);

    this.repository.save(voteData);
  }

  findAll() {
    return `This action returns all votes`;
  }

  // findByEmail(email: string) {
  //   return this.repository.findOneBy({
  //     email,
  //   });
  // }

  update(id: number, updateVoteDto: UpdateVoteDto) {
    return `This action updates a #${id} vote`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
