export class CreateVoteDto {
  title: string;
  description?: string;
  dateOfStart?: string;
  dateOfEnd?: string;
  isAnonymous: boolean;
  isActive?: boolean;
  isHidenCount: boolean;
  isPrivate: boolean;
  privateUsers?: number[];
  files?: {
    file: string;
    name: string;
    type: string;
  }[];
  photos?: {
    file: string;
    name: string;
    type: string;
  }[];
  questions: {
    title: string;
    description: string;
    answers: string[];
    files?: {
      file: string;
      name: string;
      type: string;
    }[];
    photos?: {
      file: string;
      name: string;
      type: string;
    }[];
    isMultiply: boolean;
  }[];
}
