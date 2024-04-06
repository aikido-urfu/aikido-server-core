import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Vote } from '../../votes/entities/vote.entity';
import { Mail } from 'src/mail/entities/mail.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  group: string;

  @OneToMany(() => Vote, (vote) => vote.creator)
  votes: Vote[];

  @OneToMany(() => Mail, (mail) => mail.user)
  mailsSended: Mail[];

  @ManyToMany(() => Vote, (vote) => vote.usersVoted)
  voted: Vote[];

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  telegramUserID: string;
}
