import { ApiProperty } from '@nestjs/swagger';

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
  files?: string[];
  photos?: string[];
  questions: {
    title: string;
    description: string;
    answers: string[];
    files: string[];
    photos: string[];
    isMultiply: boolean;
  }[];
}
