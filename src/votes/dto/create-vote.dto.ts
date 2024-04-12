export class CreateVoteDto {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isAnonymous: boolean;
  isHidenCount: boolean;
  respondents?: number[];
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
