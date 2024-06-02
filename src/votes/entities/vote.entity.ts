import { Group } from 'src/groups/entities/group.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Questions } from 'src/questions/entities/questions.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  creationDate: Date;

  @Column()
  isAnonymous: boolean;

  @ManyToMany(() => User, (user) => user.assigned, {
    cascade: true,
  })
  @JoinTable()
  respondents?: User[];

  @ManyToMany(() => Group, (group) => group.assigned, {
    cascade: true,
  })
  @JoinTable()
  attachedGroups?: Group[];

  @Column('text', { array: true, nullable: true })
  files?: number[];

  @Column('text', { array: true, nullable: true })
  photos?: string[];

  @ManyToOne(() => User, (user) => user.createdVotes)
  creator: User;

  @Column('integer', { array: true, default: [] })
  usersVoted: number[];

  @OneToMany(() => Questions, (questions) => questions.vote)
  questions: Questions[];

  @OneToMany(() => Message, (message) => message.vote)
  messages: Message[];
}
