import { Vote } from "src/votes/entities/vote.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => Vote, (vote) => vote.messages)
    vote: Vote;

    @Column()
    userId: number;

    @Column()
    reference: boolean;

    @Column({ nullable: true })
    refToUserId?: number;
}
