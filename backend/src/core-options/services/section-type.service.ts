import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionType } from '../entities/section-type.entity';

@Injectable()
export class SectionTypeService {
  constructor(
    @InjectRepository(SectionType)
    private readonly sectionTypeRepository: Repository<SectionType>,
  ) {}

  findAll(): Promise<SectionType[]> {
    return this.sectionTypeRepository.find();
  }

  findOne(id: string): Promise<SectionType> {
    return this.sectionTypeRepository.findOne({ where: { id } });
  }

  create(name: string): Promise<SectionType> {
    const sectionType = this.sectionTypeRepository.create({ name });
    return this.sectionTypeRepository.save(sectionType);
  }

  async remove(id: string): Promise<void> {
    await this.sectionTypeRepository.delete(id);
  }
}
