import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Vote } from '../../votes/entities/vote.entity';
import { Group } from 'src/groups/entities/group.entity';

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

  @ManyToOne(() => Group, (group) => group.users)
  group?: Group;

  @OneToMany(() => Vote, (vote) => vote.creator)
  votes: Vote[];

  @ManyToMany(() => Vote, (vote) => vote.usersVoted)
  voted: Vote[];

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  telegramUserID: string;
}
