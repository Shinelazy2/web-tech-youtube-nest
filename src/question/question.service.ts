import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async cascadeTest(): Promise<Question> {
    const category1 = new Category();
    category1.name = 'ORMs';

    const category2 = new Category();
    category2.name = 'Programming';

    const question = new Question();
    question.title = 'How to ask questions?';
    question.text = 'Where can I ask TypeORM-related questions?';
    question.categories = [category1, category2];
    return await this.questionRepository.manager.save(question);
  }
}
