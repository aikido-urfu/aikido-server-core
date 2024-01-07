import { Module } from '@nestjs/common';
import { Files } from './entities/files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [TypeOrmModule.forFeature([Files])],
  exports: [FilesService],
})
export class FilesModule {}
