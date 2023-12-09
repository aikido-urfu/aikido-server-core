import { Controller } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('votes')
export class QuestionsController {
  constructor(private readonly votesService: QuestionsService) {}
}
