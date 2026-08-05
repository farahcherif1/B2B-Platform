import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormSection } from '../entities/form-section.entity';
import { FindOptionsWhere, Repository, In } from 'typeorm';
import { CreateFormSectionDto } from '../dtos/form-section-dto/create-form-section.dto';
import { Field } from 'src/application-management/entities/field.entity';
import { Event } from 'src/event-management/entities/event.entity';

@Injectable()
export class FormSectionService {
  constructor(
    @InjectRepository(FormSection)
    private formSectionRepository: Repository<FormSection>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async findAll(): Promise<FormSection[]> {
    return this.formSectionRepository.find();
  }

  async findOne(id: string): Promise<FormSection> {
    const formSection = await this.formSectionRepository.findOne({
      where: { id: id },
    });
    if (!formSection) throw new NotFoundException('Form section not found');
    return formSection;
  }

  async create(
    createFormSectionDto: CreateFormSectionDto,
  ): Promise<FormSection> {
    const { name, eventId, fieldIds } = createFormSectionDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');
    const fields = await this.fieldRepository.find({
      where: { id: In(fieldIds) },
    });
    const formSection = this.formSectionRepository.create({
      name,
      event,
      fields,
    });
    return this.formSectionRepository.save(formSection);
  }

  async getFields(id: string): Promise<Field[]> {
    const formSection = await this.formSectionRepository.findOne({
      where: { id: id },
      relations: ['fields', 'fields.dependencies', 'fields.dependentQuestions'],
    });
    if (!formSection) throw new NotFoundException('Form section not found');

    return formSection.fields;
  }

  async getFormSectionsByEventId(eventId: string): Promise<Field[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');
    const formSections = await this.formSectionRepository.findOne({
      where: { event: { id: eventId } },
      relations: ['fields', 'fields.participantsType'],
    });

    if (!formSections) {
      const formSection = this.formSectionRepository.create({
        name: 'Default',
        event,
      });
      await this.formSectionRepository.save(formSection);
      return formSection.fields;
    }

    return formSections.fields;
  }

  async addFieldToFormSection(eventId: string, fieldId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
    });

    if (!field) throw new NotFoundException('Field not found');
    const formSection = await this.formSectionRepository.findOne({
      where: { event: { id: eventId } },
      relations: ['fields'],
    });

    if (!formSection) throw new NotFoundException('Form section not found');

    formSection.fields.push(field);
    return this.formSectionRepository.save(formSection);
  }

  private topologicalSort(graph: Map<string, string[]>) {
    const visited = new Set<string>();
    const stack = new Array<string>();
    const dfs = (node: string) => {
      visited.add(node);
      graph.get(node)?.forEach((child) => {
        if (!visited.has(child)) {
          dfs(child);
        }
      });
      stack.push(node);
    };
    graph.forEach((_, node) => {
      if (!visited.has(node)) {
        dfs(node);
      }
    });
    return stack.reverse();
  }
  async getFieldsByEventId(eventId: string, participationId: string): Promise<Field[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');
    const formSections = await this.formSectionRepository.findOne({
      where: { event: { id: eventId } },
      relations: [
        'fields',
        'fields.choices',
        'fields.participantsType',
        'fields.dependencies',
        'fields.dependentQuestions',
        'fields.dependencies.dependentQuestion',
      ],
    });

    if (!formSections) {
      const formSection = this.formSectionRepository.create({
        name: 'Default',
        event,
      });
      await this.formSectionRepository.save(formSection);
    }

    if (!participationId) {
      return formSections?.fields || [];
    }
    formSections.fields = formSections.fields.filter((field) => {
      if (!field.participantsType || field.participantsType.length == 0) {
        return true;
      }
      const isParticipant = field.participantsType.find(
        (participant) => participant.id == participationId,
      );
      if (isParticipant) return true;
      return false;
    });
    const graph = new Map<string, string[]>();
    formSections.fields.forEach((field) => {
      field.dependencies.forEach((dependency) => {
        if (graph.has(dependency.dependentQuestion.id)) {
          graph.get(dependency.dependentQuestion.id).push(field.id);
        } else {
          graph.set(dependency.dependentQuestion.id, [field.id]);
        }
      });
    });
    const sortedFields = this.topologicalSort(graph);
    formSections.fields = formSections.fields.sort((a, b) => {
      return sortedFields.indexOf(a.id) - sortedFields.indexOf(b.id);
    });

    return formSections.fields;
  }

  async getChoicesByEventId(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');
    const formSections = await this.formSectionRepository.findOne({
      where: { event: { id: eventId } },
      relations: ['fields', 'fields.choices'],
    });

    if (!formSections) {
      const formSection = this.formSectionRepository.create({
        name: 'Default',
        event,
      });
      await this.formSectionRepository.save(formSection);
    }

    return formSections.fields.flatMap((field) =>
      field.choices.map((choice) => ({
        id: choice.id,
        name: choice.name,
        dependentQuestionId: field.id,
      })),
    );
  }
}
