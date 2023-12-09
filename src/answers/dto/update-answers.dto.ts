import { PartialType } from '@nestjs/swagger';
import { CreateAnswersDto } from './create-answers.dto';

export class UpdateAnswersDto extends PartialType(CreateAnswersDto) {}
