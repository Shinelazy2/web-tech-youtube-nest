import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  cascadeTest(): Promise<Question> {
    return this.questionService.cascadeTest();
  }
}
