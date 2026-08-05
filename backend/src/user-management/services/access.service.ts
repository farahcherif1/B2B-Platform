import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccessDto } from '../dtos/access-dto/create-access.dto';
import { UpdateAccessDto } from '../dtos/access-dto/update-access.dto';
import { Access } from '../entities/access.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private accessRepository: Repository<Access>,
  ) {}

  async create(createAccessDto: CreateAccessDto): Promise<Access> {
    const access = this.accessRepository.create(createAccessDto);
    return this.accessRepository.save(access);
  }

  async findAll(): Promise<Access[]> {
    return this.accessRepository.find();
  }

  async findOne(id: string): Promise<Access> {
    const access = await this.accessRepository.findOne({ where: { id } });
    if (!access) {
      throw new NotFoundException('Access Not found');
    }
    return access;
  }

  async update(id: string, updateAccessDto: UpdateAccessDto): Promise<Access> {
    const access = await this.findOne(id);
    Object.assign(access, updateAccessDto);
    return this.accessRepository.save(access);
  }

  async remove(id: string): Promise<void> {
    const access = await this.findOne(id);
    await this.accessRepository.remove(access);
  }
}
