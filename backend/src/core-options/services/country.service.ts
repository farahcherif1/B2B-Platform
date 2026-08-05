import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from '../dto/create-country.dto';
import { UpdateCountryDto } from '../dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../entities/country.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}
  create(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = this.countryRepository.create(createCountryDto);
    return this.countryRepository.save(country);
  }

  findAll(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  findOne(id: string): Promise<Country | null> {
    return this.countryRepository.findOne({
      where: { id },
    });
  }

  update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<UpdateResult> {
    return this.countryRepository.update(id, updateCountryDto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.countryRepository.delete(id);
  }
}
