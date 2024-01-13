import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Server is working! Congrats';
  }

  getFile(id: string) {
    const imagePath = path.join(__dirname, '../../..', 'uploads', id);
    return imagePath;
  }
}
