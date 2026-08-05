import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { SectionService } from '../services/section.service';
import { CreateSectionDto } from '../dtos/create-section.dto';
import { UpdateSectionDto } from '../dtos/update-section.dto';

@Controller('sections/:tabId')
@UseInterceptors(ClassSerializerInterceptor)
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(
    @Param('tabId') tabId: string,
    @Body() createSectionDto: CreateSectionDto,
  ) {
    return this.sectionService.create(tabId, createSectionDto);
  }

  @Get()
  findAll(@Param('tabId') tabId: string) {
    return this.sectionService.findAllByTabId(tabId);
  }

  @Get(':id')
  findOne(@Param('tabId') tabId: string, @Param('id') id: string) {
    return this.sectionService.findOne(tabId, id);
  }

  @Patch(':id')
  update(
    @Param('tabId') tabId: string,
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionService.update(tabId, id, updateSectionDto);
  }

  @Delete(':id')
  remove(@Param('tabId') tabId: string, @Param('id') id: string) {
    return this.sectionService.remove(tabId, id);
  }
}
