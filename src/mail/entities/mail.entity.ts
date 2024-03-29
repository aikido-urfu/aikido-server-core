import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mail')
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theme: string;

  @Column()
  text: string;

  @Column()
  date: string;

  @Column('text', { array: true, nullable: true })
  files?: number[];

  @Column('text', { array: true, nullable: true })
  photos?: string[];

  @Column('integer', { array: true, nullable: true })
  readenByUsers: number[];

  @ManyToOne(() => User, (user) => user.mailsSended)
  user: User;

  @Column('integer', { array: true, nullable: true })
  receivers: number[];
}
