import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { FieldDependencyService } from '../services/field-dependency.service';
import { CreateFieldDependencyDto } from '../dtos/field-dependency-dto/create-field-dependency.dto';

@Controller('field-dependencies')
export class FieldDependencyController {
  constructor(
    private readonly fieldDependencyService: FieldDependencyService,
  ) {}

  @Get()
  async findAll() {
    return this.fieldDependencyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.fieldDependencyService.findOne(id);
  }

  /**
   * Create a new field dependency.
   */
  @Post()
  async create(@Body() createFieldDependencyDto: CreateFieldDependencyDto) {
    const { questionId, dependentQuestionId, choiceId } =
      createFieldDependencyDto;

    return this.fieldDependencyService.create(
      questionId,
      dependentQuestionId,
      choiceId,
    );
  }

  @Get(':id/choice')
  async findChoice(@Param('id') id: string) {
    return await this.fieldDependencyService.findChoiceByDependencyId(id);
  }

  /**
   * Fetch all dependencies for a specific question.
   */
  @Get('question/:questionId')
  async findByQuestion(@Param('questionId') questionId: string) {
    const dependencies =
      await this.fieldDependencyService.findByQuestion(questionId);

    if (!dependencies || dependencies.length === 0) {
      throw new NotFoundException(
        `No dependencies found for question with ID ${questionId}`,
      );
    }

    return dependencies;
  }

  /**
   * Fetch all dependencies for a specific dependent question.
   */
  @Get('dependent-question/:dependentQuestionId')
  async findByDependentQuestion(
    @Param('dependentQuestionId') dependentQuestionId: string,
  ) {
    const dependencies =
      await this.fieldDependencyService.findByDependentQuestion(
        dependentQuestionId,
      );

    if (!dependencies || dependencies.length === 0) {
      throw new NotFoundException(
        `No dependencies found for dependent question with ID ${dependentQuestionId}`,
      );
    }

    return dependencies;
  }

  /**
   * Fetch all dependencies for a specific choice.
   */
  @Get('choice/:choiceId')
  async findByChoice(@Param('choiceId') choiceId: string) {
    const dependencies =
      await this.fieldDependencyService.findByChoice(choiceId);

    if (!dependencies || dependencies.length === 0) {
      throw new NotFoundException(
        `No dependencies found for choice with ID ${choiceId}`,
      );
    }

    return dependencies;
  }

  /**
   * Delete a dependency by ID.
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.fieldDependencyService.delete(id);
  }
}
