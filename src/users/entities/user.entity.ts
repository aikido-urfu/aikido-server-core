import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
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

  @OneToMany(() => Vote, (vote) => vote.user)
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
  telegram: string;

  @Column({ nullable: true })
  telegramUserID: string;
}
