import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FieldService } from '../services/field.service';
import { CreateFieldDto } from '../dtos/field-dto/create-field.dto';
import { UpdateFieldDto } from '../dtos/field-dto/update-field.dto';
import { Organaizer } from 'src/auth/core/decorators/organizer.decorator';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Get()
  findAll() {
    return this.fieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldService.findOne(id);
  }

  @Get(':id/related-fields')
  findRelatedFields(@Param('id') id: string) {
    return this.fieldService.findRelatedFields(id);
  }

  @Get(':id/choices')
  findChoices(@Param('id') id: string) {
    return this.fieldService.findChoices(id);
  }

  @Get('fielsByIds/:ids')
  findByIds(@Param('ids') ids: string) {
    const idsArray = ids.split(',');
    return this.fieldService.findByIds(idsArray);
  }

  @Post()
  @Organaizer()
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldService.create(createFieldDto);
  }

  @Put()
  @Organaizer()
  update(@Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldService.update(updateFieldDto);
  }

  @Delete(':id')
  @Organaizer()
  delete(@Param('id') id: string) {
    return this.fieldService.remove(id);
  }
}
