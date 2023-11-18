import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';

@Module({
  controllers: [VotesController],
  providers: [VotesService],
  imports: [TypeOrmModule.forFeature([Vote])],
})
export class VotesModule {}
