export class CreateVoteDto {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isAnonymous: boolean;
  isHidenCount: boolean;
  privateUsers?: number[];
  files?: number[];
  photos?: string[];
  questions: {
    title: string;
    description: string;
    answers: string[];
    files?: string[];
    photos?: string[];
    isMultiply: boolean;
  }[];
}
