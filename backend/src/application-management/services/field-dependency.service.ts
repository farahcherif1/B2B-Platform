import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldDependency } from '../entities/field-dependency.entity';
import { Field } from '../entities/field.entity';
import { Choice } from '../../core-options/entities/choice.entity';
import { UpdateFieldDependencyDto } from '../dtos/field-dependency-dto/update-field-dependency.dto';

@Injectable()
export class FieldDependencyService {
  constructor(
    @InjectRepository(FieldDependency)
    private readonly fieldDependencyRepository: Repository<FieldDependency>,
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
    @InjectRepository(Choice)
    private readonly choiceRepository: Repository<Choice>,
  ) {}

  async findAll(): Promise<FieldDependency[]> {
    return this.fieldDependencyRepository.find();
  }

  async findOne(id: string): Promise<FieldDependency> {
    const dependency = await this.fieldDependencyRepository.findOne({
      where: { id },
      relations: ['question', 'dependentQuestion', 'choice'],
    });

    if (!dependency) {
      throw new NotFoundException(`Dependency with ID ${id} not found`);
    }

    return dependency;
  }

  /**
   * Create a new field dependency.
   */
  async create(
    questionId: string,
    dependentQuestionId: string,
    choiceId: string,
  ): Promise<FieldDependency> {
    const question = await this.fieldRepository.findOne({
      where: { id: questionId },
    });

    const dependentQuestion = await this.fieldRepository.findOne({
      where: { id: dependentQuestionId },
    });
    const choice = await this.choiceRepository.findOne({
      where: { id: choiceId },
    });

    if (!question || !dependentQuestion || !choice) {
      throw new NotFoundException(
        'Question, dependent question, or choice not found',
      );
    }

    const dependency = this.fieldDependencyRepository.create({
      question,
      dependentQuestion,
      choice,
    });

    return this.fieldDependencyRepository.save(dependency);
  }

  /**
   * Fetch all dependencies for a specific question.
   */
  async findByQuestion(questionId: string): Promise<FieldDependency[]> {
    return this.fieldDependencyRepository.find({
      where: { question: { id: questionId } },
      relations: ['dependentQuestion', 'choice'],
    });
  }

  async findChoiceByDependencyId(dependencyId: string): Promise<Choice> {
    const dependency = await this.fieldDependencyRepository.findOne({
      where: { id: dependencyId },
      relations: ['choice'],
    });

    if (!dependency) {
      throw new NotFoundException(
        `Dependency with ID ${dependencyId} not found`,
      );
    }

    return dependency.choice;
  }

  /**
   * Fetch all dependencies for a specific dependent question.
   */
  async findByDependentQuestion(
    dependentQuestionId: string,
  ): Promise<FieldDependency[]> {
    return this.fieldDependencyRepository.find({
      where: { dependentQuestion: { id: dependentQuestionId } },
      relations: ['question', 'choice'],
    });
  }

  async findByChoice(choiceId: string): Promise<FieldDependency[]> {
    return this.fieldDependencyRepository.find({
      where: { choice: { id: choiceId } },
      relations: ['question', 'dependentQuestion'],
    });
  }

  /**
   * Delete a dependency by ID.
   */
  async delete(id: string): Promise<void> {
    const dependency = await this.fieldDependencyRepository.findOne({
      where: { id },
    });

    if (!dependency) {
      throw new NotFoundException(`Dependency with ID ${id} not found`);
    }

    await this.fieldDependencyRepository.remove(dependency);
  }

  async update(
    fieldId: string,
    updateFieldDependencyDto: UpdateFieldDependencyDto,
  ): Promise<FieldDependency> {
    const fieldDependency = await this.fieldDependencyRepository.findOne({
      where: { question: { id: fieldId } },
    });

    if (!fieldDependency) {
      return this.create(
        fieldId,
        updateFieldDependencyDto.dependentQuestionId,
        updateFieldDependencyDto.choiceId,
      );
    }

    const { dependentQuestionId, choiceId } = updateFieldDependencyDto;

    const dependentQuestion = await this.fieldRepository.findOne({
      where: { id: dependentQuestionId },
    });
    const choice = await this.choiceRepository.findOne({
      where: { id: choiceId },
    });

    if (!dependentQuestion || !choice) {
      throw new NotFoundException('Dependent question or choice not found');
    }

    fieldDependency.dependentQuestion = dependentQuestion;
    fieldDependency.choice = choice;

    return this.fieldDependencyRepository.save(fieldDependency);
  }

  async deleteByFieldId(fieldId: string): Promise<void> {
    const fieldDependency = await this.fieldDependencyRepository.findOne({
      where: { question: { id: fieldId } },
    });

    if (!fieldDependency) {
      throw new NotFoundException(`Dependency with ID ${fieldId} not found`);
    }

    await this.fieldDependencyRepository.remove(fieldDependency);
  }
}
