import { Injectable } from '@nestjs/common';
import { CreateIntervalDto } from './dto/create-interval.dto';
import { UpdateIntervalDto } from './dto/update-interval.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interval } from './entities/interval.entity';
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

  async findOneBySessionId(id: number) {
    return await this.intervalRepository
      .createQueryBuilder('interval')
      .where('interval.sessionId = :id', { id })
      .getMany();
  }

  update(id: number, updateIntervalDto: UpdateIntervalDto) {
    // return this.intervalRepository.update(id, updateIntervalDto).then(() => {
    //   return this.findOne(id);
    // });
  }

  remove(id: number) {
    return this.intervalRepository.delete(id).then(() => {
      return { deleted: true };
    });
  }
}
