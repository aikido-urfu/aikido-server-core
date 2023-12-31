import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { saveFile } from 'src/tools/saveFile';
import { DeepPartial, Repository } from 'typeorm';
import { Mail } from './entities/mail.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail)
    private repository: Repository<Mail>,
  ) {}

  async create(userId, createMailDto: CreateMailDto) {
    try {
      const { theme, recievers, text, files, photos } = createMailDto;
      const filesIds = [];

      if (files && files.length) {
        for (const file of files) {
          const savedFile = await saveFile(file);
          await filesIds.push(savedFile);
        }
      }

      const photosIds = [];

      if (photos && photos.length) {
        for (const photo of photos) {
          const savedPhoto = await saveFile(photo);
          await photosIds.push(savedPhoto);
        }
      }

      const mailData = await {
        user: userId,
        theme,
        recievers,
        text,
      };

      const mail = await this.repository.save(mailData);
      return mail;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findAll(userId) {
    try {
      const mails = await this.repository.find({ relations: ['user'] });

      const result = await mails.filter(
        (el) => el.recievers && el.recievers.includes(userId),
      );

      const response = [];

      for (const el of result) {
        response.push({
          id: el.id,
          theme: el.theme,
          text: el.text,
          date: Date.now() + '',
          photos: el.photos,
          files: el.files,
          isReaden:
            el.readenByUsers && el.readenByUsers.includes(userId)
              ? true
              : false,
          recievers: el.recievers,
          user: {
            id: el.user.id,
            fullName: el.user.fullName,
            email: el.user.email,
            photo: el.user.photo,
          },
        });
      }

      return response;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async readMail(userId, id) {
    try {
      const mail = await this.repository.findOneBy({ id });

      const readenByUsers = Array.isArray(mail.readenByUsers)
        ? mail.readenByUsers
        : [];

      readenByUsers.push(userId);

      await this.repository.save({ ...mail, readenByUsers });
      return;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
