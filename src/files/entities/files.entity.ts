import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: number;
}
