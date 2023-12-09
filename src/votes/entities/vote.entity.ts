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

  @Column({ nullable: true })
  isActive?: boolean;

  @Column({ nullable: true })
  dateOfEnd?: string;

  @Column({ nullable: true })
  dateOfStart?: string;

  @Column()
  creationDate: string;

  @Column()
  isPrivate: boolean;

  @Column('integer', { array: true, nullable: true })
  privateUsers?: number[];

  @Column('text', { array: true, nullable: true })
  files?: string[];

  @Column('text', { array: true, nullable: true })
  photos?: string[];

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @OneToMany(() => Questions, (questions) => questions.vote)
  questions: Questions[];
}
