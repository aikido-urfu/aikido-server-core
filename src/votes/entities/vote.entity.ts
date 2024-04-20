import { Questions } from 'src/questions/entities/questions.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamptz'})
  endDate: Date;

  @Column({ type: 'timestamptz'})
  startDate: Date;

  @Column({ type: 'timestamptz' })
  creationDate: Date;

  @Column()
  isAnonymous: boolean;

  @Column('integer', { array: true, nullable: true })
  respondents?: number[];

  @Column('text', { array: true, nullable: true })
  files?: number[];

  @Column('text', { array: true, nullable: true })
  photos?: string[];

  @ManyToOne(() => User, (user) => user.votes)
  creator: User;

  @Column('integer', { array: true, default: [] })
  usersVoted: number[];

  @OneToMany(() => Questions, (questions) => questions.vote)
  questions: Questions[];
}
