import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  voteName: string;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;
}
