import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Choice } from '../entities/choice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChoiceService {
  constructor(
    @InjectRepository(Choice)
    private readonly choiceRepository: Repository<Choice>,
  ) {}

  async create(name: string) {
    return this.choiceRepository.save({ name });
  }

  async findAll() {
    return this.choiceRepository.find();
  }

  async update(id: string, name: string) {
    return this.choiceRepository.update(id, { name });
  }

  async remove(id: string) {
    return this.choiceRepository.delete(id);
  }
}
