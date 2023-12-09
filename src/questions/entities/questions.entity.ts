import { Answers } from 'src/answers/entities/answers.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('questions')
export class Questions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text', { array: true })
  files: string[];

  @Column('text', { array: true })
  photos: string[];

  @Column()
  isMultiply: boolean;

  @ManyToOne(() => Vote, (vote) => vote.questions)
  vote: Vote;

  @OneToMany(() => Questions, (question) => question.answers)
  answers: Answers[];
}
