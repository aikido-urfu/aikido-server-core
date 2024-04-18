import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [
    TypeOrmModule.forFeature([Group]),
    UsersModule,
  ],
  exports: [GroupsService]
})
export class GroupsModule {}
