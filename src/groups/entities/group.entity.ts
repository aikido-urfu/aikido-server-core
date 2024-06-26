import { User } from 'src/users/entities/user.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.group)
  users: User[];
}
