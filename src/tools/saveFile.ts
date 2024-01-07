import { HttpException, HttpStatus } from '@nestjs/common';
import { generateId } from './storage';
import { join } from 'path';
import * as fs from 'fs';

export const saveFile = (body) => {
  const { file, name, type } = body;
  if (!file || !name || !type) {
    throw new HttpException(
      'Invalid file data provided',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Преобразование base64 в бинарный буфер
  const buffer = Buffer.from(file, 'base64');

  // const uploadPath = join(__dirname, '..', 'uploads', name);
  const ext = name.slice(name.lastIndexOf('.'));
  const newName = generateId() + ext;
  const uploadPath = join(process.cwd(), 'uploads', newName);
  fs.writeFile(uploadPath, buffer, (err) => {
    if (err) {
      // Обрабатываете ошибку
    } else {
      // Файл успешно записан
    }
  });

  return newName;
};
