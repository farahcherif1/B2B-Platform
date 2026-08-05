import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SectionTypeService } from '../services/section-type.service';
import { SectionType } from '../entities/section-type.entity';

@Controller('section-types')
export class SectionTypeController {
  constructor(private readonly sectionTypeService: SectionTypeService) {}

  @Get()
  findAll(): Promise<SectionType[]> {
    return this.sectionTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SectionType> {
    return this.sectionTypeService.findOne(id);
  }

  @Post()
  create(@Body('name') name: string): Promise<SectionType> {
    return this.sectionTypeService.create(name);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.sectionTypeService.remove(id);
  }
}
