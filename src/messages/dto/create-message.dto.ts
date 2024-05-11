export class CreateMessageDto {
    userId: number;
    voteId: number;
    text: string;
    isRef: boolean;
    refComId?: number;
}
