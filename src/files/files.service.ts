import { Injectable } from '@nestjs/common';
import { Files } from './entities/files.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private repository: Repository<Files>,
  ) {}

  async saveFile({ url, name, type }) {
    return await this.repository.save({ url, name, type });
  }

  async getById(id) {
    const file = await this.repository.findOne({ where: { id } });

    return file;
  }
}
