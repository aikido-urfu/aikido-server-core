import { AnswersService } from './answers.service';

export class AnswersController {
  constructor(private readonly votesService: AnswersService) {}
}
