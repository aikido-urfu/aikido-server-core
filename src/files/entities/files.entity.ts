import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  type: string;
}
