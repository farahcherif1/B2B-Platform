import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Field } from '../entities/field.entity';
import { CreateFieldDto } from '../dtos/field-dto/create-field.dto';
import { Choice } from 'src/core-options/entities/choice.entity';
import { UpdateFieldDto } from '../dtos/field-dto/update-field.dto';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
// import { FieldDependency } from 'src/field-dependency/entities/field-dependency.entity';
import { FieldDependencyService } from 'src/application-management/services/field-dependency.service';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
    @InjectRepository(TypeParticipant)
    private readonly typeParticipantRepository: Repository<TypeParticipant>,
    @InjectRepository(Choice)
    private readonly choiceRepository: Repository<Choice>,
    private readonly fieldDependencyService: FieldDependencyService, // Inject FieldDependencyService
  ) {}

  async findAll(): Promise<Field[]> {
    return this.fieldRepository.find();
  }

  async create(createFieldDto: CreateFieldDto): Promise<Field> {
    const {
      title,
      type,
      description,
      participantsTypeId,
      required,
      choiceIds,
      dependencies,
    } = createFieldDto;

    // Use In operator instead of deprecated findByIds
    const participantsType = await this.typeParticipantRepository.find({
      where: { id: In(participantsTypeId) },
    });
    if (participantsType.length !== participantsTypeId.length) {
      throw new NotFoundException('One or more participants type not found');
    }

    // Use In operator instead of deprecated findByIds
    const choices = await this.choiceRepository.find({
      where: choiceIds?.length ? { id: In(choiceIds) } : {},
    });

    const field = this.fieldRepository.create({
      title,
      type,
      description,
      participantsType,
      required,
      choices,
    });

    const savedField = await this.fieldRepository.save(field);

    if (dependencies && dependencies[0] && dependencies.length > 0) {
      for (const dependency of dependencies) {
        const { choiceId, dependentQuestionId } = dependency;

        // Convert IDs to strings if they're not already
        const choiceIdStr = String(choiceId);
        const dependentQuestionIdStr = String(dependentQuestionId);

        const choice = await this.choiceRepository.findOne({
          where: { id: choiceIdStr },
        });
        const dependentQuestion = await this.fieldRepository.findOne({
          where: { id: dependentQuestionIdStr },
        });

        if (!choice || !dependentQuestion) {
          throw new NotFoundException('Choice or dependent question not found');
        }

        await this.fieldDependencyService.create(
          savedField.id,
          dependentQuestionIdStr,
          choiceIdStr,
        );
      }
    }

    return savedField;
  }

  async update(updateFieldDto: UpdateFieldDto): Promise<Field> {
    // Convert ID to string if it's not already
    const fieldId = String(updateFieldDto.id);

    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
      relations: [
        'choices',
        'participantsType',
        'relatedField',
        'dependencies',
      ],
    });
    // console.log('i found the field ', field);

    if (!field) throw new NotFoundException('Field not found');
    const {
      title,
      type,
      description,
      participantsTypeId,
      required,
      relatedFieldId,
      choiceIds,
      dependencies,
    } = updateFieldDto;

    if (dependencies && dependencies.length > 0 && dependencies[0]) {
      // Convert dependency IDs to strings
      const dependencyToUpdate = {
        ...dependencies[0],
        choiceId: String(dependencies[0].choiceId),
        dependentQuestionId: String(dependencies[0].dependentQuestionId),
      };

      const newOne = await this.fieldDependencyService.update(
        field.id,
        dependencyToUpdate,
      );
      field.dependencies.push(newOne);
    } else {
      await this.fieldDependencyService.deleteByFieldId(field.id);
    }
    if (participantsTypeId !== undefined) {
      const participantsType = await this.typeParticipantRepository.find({
        where: { id: In(participantsTypeId) },
      });
      if (participantsType.length !== participantsTypeId.length)
        throw new NotFoundException('Participants type not found');
      field.participantsType = participantsType || field.participantsType;
    }

    if (relatedFieldId !== undefined) {
      // Convert ID to string if it's not already
      const relatedFieldIdStr = String(relatedFieldId);

      const relatedField = await this.fieldRepository.findOne({
        where: { id: relatedFieldIdStr },
      });

      if (!relatedField) {
        throw new NotFoundException('Related field not found');
      }
      field.relatedField = relatedField || field.relatedField;
    }
    if (choiceIds !== undefined) {
      const choices = await this.choiceRepository.find({
        where: { id: In(choiceIds) },
      });
      if (choices.length !== choiceIds.length) {
        throw new NotFoundException('Choices not found');
      }
      field.choices = choices || field.choices;
    }

    field.title = title || field.title;
    field.type = type || field.type;
    field.description = description || field.description;

    field.required = required !== undefined ? required : field.required;
    await this.fieldRepository.save(field);
    const newField = await this.fieldRepository.findOne({
      where: { id: field.id },
      relations: [
        'choices',
        'participantsType',
        'relatedField',
        'dependencies',
      ],
    });
    return newField;
  }

  async remove(id: string): Promise<void> {
    const field = await this.fieldRepository.findOne({
      where: { id },
    });
    if (!field) throw new NotFoundException('Field not found');
    await this.fieldRepository.remove(field);
  }

  async findOne(id: string): Promise<Field> {
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: [
        'choices',
        'participantsType',
        'relatedFields',
        'dependencies',
        'dependentQuestions',
      ],
    });
    if (!field) throw new NotFoundException('Field not found');
    return field;
  }

  async findChoices(id: string): Promise<Choice[]> {
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: ['choices'],
    });
    if (!field) throw new NotFoundException('Field not found');
    return field.choices;
  }

  async findParticipantsType(id: string): Promise<TypeParticipant[]> {
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: ['participantsType'],
    });
    if (!field) throw new NotFoundException('Field not found');
    return field.participantsType;
  }

  async findRelatedField(id: string): Promise<Field> {
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: ['relatedField'],
    });
    if (!field) throw new NotFoundException('Field not found');
    return field.relatedField;
  }

  async findRelatedFields(id: string): Promise<Field[]> {
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: ['relatedFields'],
    });
    if (!field) throw new NotFoundException('Field not found');
    return field.relatedFields;
  }
  async findByIds(idsArray: string[]): Promise<Field[]> {
    const fields = await this.fieldRepository.find({
      where: { id: In(idsArray) },
    });
    if (!fields || fields.length === 0) throw new NotFoundException('Fields not found');
    return fields;
  }
}
