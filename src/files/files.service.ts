import { Injectable } from '@nestjs/common';
import { Files } from './entities/files.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../tools/s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private repository: Repository<Files>,
  ) {}

  async saveFileOb(fileName: string, file: Buffer) {
    try {
      const parallelUploads3 = new Upload({
        client: s3Client,
        params: {
          Bucket: 'projectdhdygfuyfguyfvw',
          Key: fileName,
          Body: file,
        },
      });

      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });

      const results = await parallelUploads3.done();
      return results.Location; // Для модульного тестирования.
    } catch (err) {
      console.log('Error', err);
    }
  }

  async saveFile({ url, name, type }) {
    return await this.repository.save({ url, name, type });
  }

  async getById(id) {
    const file = await this.repository.findOne({ where: { id } });

    return file;
  }
}
