import { Vote } from 'src/votes/entities/vote.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Vote, (vote) => vote.messages)
  vote: Vote;

  @CreateDateColumn({ type: 'timestamptz' })
  creationDate: Date;

  @Column()
  userId: number;

  @Column()
  isRef: boolean;

  @Column({ nullable: true })
  refComId?: number;

  @Column('integer', { array: true, default: [] })
  references?: number[];
}
