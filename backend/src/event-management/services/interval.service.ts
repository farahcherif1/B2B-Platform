import { Injectable } from '@nestjs/common';
import { CreateIntervalDto } from '../dtos/interval-dto/create-interval.dto';
import { UpdateIntervalDto } from '../dtos/interval-dto/update-interval.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interval } from '../entities/interval.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class IntervalService {
  constructor(
    @InjectRepository(Interval)
    private intervalRepository: Repository<Interval>,
  ) {}

  async create(createIntervalDto: CreateIntervalDto) {
    const interval = this.intervalRepository.create(
      createIntervalDto as DeepPartial<Interval>,
    );
    return await this.intervalRepository.save(interval);
  }

  async findAll() {
    return await this.intervalRepository.find();
  }

  async findOneBySessionId(id: string) {
    return await this.intervalRepository
      .createQueryBuilder('interval')
      .where('interval.sessionId = :id', { id })
      .getMany();
  }

  update(id: string, updateIntervalDto: UpdateIntervalDto) {
    // return this.intervalRepository.update(id, updateIntervalDto).then(() => {
    //   return this.findOne(id);
    // });
  }

  remove(id: string) {
    return this.intervalRepository.delete(id).then(() => {
      return { deleted: true };
    });
  }
}
