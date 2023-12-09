import { Questions } from 'src/questions/entities/questions.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('answers')
export class Answers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  count: number;

  @ManyToOne(() => Questions, (questions) => questions.answers)
  questions: Questions;
}
