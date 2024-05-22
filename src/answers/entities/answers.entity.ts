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

  @Column('integer', { array: true, default: [] })
  users?: number[];

  @ManyToOne(() => Questions, (questions) => questions.answers, {
    cascade: true, onDelete: 'CASCADE'
  })
  questions: Questions;
}
