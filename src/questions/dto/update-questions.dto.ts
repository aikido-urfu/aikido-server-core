import { PartialType } from '@nestjs/swagger';
import { CreateQuestionsDto } from './create-questions.dto';

export class UpdateQuestionsDto extends PartialType(CreateQuestionsDto) {}
