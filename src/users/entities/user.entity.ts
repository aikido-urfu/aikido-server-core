import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vote } from '../../votes/entities/vote.entity';

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
}
