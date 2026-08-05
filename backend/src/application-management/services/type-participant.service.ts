import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TypeParticipant } from '../entities/type-participant.entity';
import { CreateTypeParticipantDto } from '../dtos/type-participant-dto/create-type-participant.dto';
import { UpdateTypeParticipantDto } from '../dtos/type-participant-dto/update-type-participant.dto';
import { Event } from 'src/event-management/entities/event.entity';

@Injectable()
export class TypeParticipantService {
  constructor(
    @InjectRepository(TypeParticipant)
    private typeParticipantRepository: Repository<TypeParticipant>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createDto: CreateTypeParticipantDto): Promise<TypeParticipant> {
    const typeParticipant = this.typeParticipantRepository.create({
      name: createDto.name,
    });

    if (createDto.eventId) {
      // Convert eventId to string if it's not already
      const eventIdStr = String(createDto.eventId);
      const event = await this.eventRepository.findOne({
        where: { id: eventIdStr },
      });
      if (event) {
        typeParticipant.event = event;
      }
    }

    if (createDto.relatedParticipantIds) {
      // Convert IDs to strings if they're not already
      const relatedIds = createDto.relatedParticipantIds.map(id => String(id));
      typeParticipant.relatedParticipants = await this.typeParticipantRepository.find({
        where: { id: In(relatedIds) },
      });
    }

    return this.typeParticipantRepository.save(typeParticipant);
  }

  async findAll(): Promise<TypeParticipant[]> {
    return this.typeParticipantRepository.find({
      relations: ['event', 'relatedParticipants'],
    });
  }

  async findOne(id: string): Promise<TypeParticipant> {
    const typeParticipant = await this.typeParticipantRepository.findOne({
      where: { id },
      relations: ['event', 'relatedParticipants'],
    });

    if (!typeParticipant) {
      throw new NotFoundException(`TypeParticipant with ID ${id} not found`);
    }
    return typeParticipant;
  }

  findByEvent(eventId: string): Promise<TypeParticipant[]> {
    return this.typeParticipantRepository.find({
      where: { event: { id: eventId } },
      relations: ['event', 'relatedParticipants'],
    });
  }

  async update(id: string, updateDto: UpdateTypeParticipantDto) {
    const typeParticipant = await this.typeParticipantRepository.findOne({
      where: { id },
      relations: ['relatedParticipants'],
    });

    if (!typeParticipant) {
      throw new NotFoundException(`TypeParticipant with ID ${id} not found`);
    }

    if (updateDto.name) typeParticipant.name = updateDto.name;

    if (updateDto.relatedParticipantIds) {
      // Convert IDs to strings if they're not already
      const relatedIds = updateDto.relatedParticipantIds.map(id => String(id));
      typeParticipant.relatedParticipants = await this.typeParticipantRepository.find({
        where: { id: In(relatedIds) },
      });
    }

    return this.typeParticipantRepository.save(typeParticipant);
  }

  async remove(id: string): Promise<void> {
    const typeParticipant = await this.typeParticipantRepository.findOne({
      where: { id },
      relations: ['relatedParticipants'],
    });

    if (!typeParticipant) {
      throw new Error(`TypeParticipant with id ${id} not found`);
    }

    await this.typeParticipantRepository
      .createQueryBuilder()
      .relation(TypeParticipant, 'relatedParticipants')
      .of(typeParticipant)
      .remove(typeParticipant.relatedParticipants);

    await this.typeParticipantRepository
      .createQueryBuilder()
      .relation(TypeParticipant, 'relatedParticipants')
      .of(typeParticipant.relatedParticipants)
      .remove(typeParticipant);

    await this.typeParticipantRepository.delete(id);
  }
}
