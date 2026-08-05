import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FormSectionService } from '../services/form-section.service';
import { CreateFormSectionDto } from '../dtos/form-section-dto/create-form-section.dto';
import { Organaizer } from 'src/auth/core/decorators/organizer.decorator';

@Controller('form-section')
export class FormSectionController {
  constructor(private readonly formSectionService: FormSectionService) {}

  @Get()
  @Organaizer()
  findAll() {
    return this.formSectionService.findAll();
  }

  @Get(':id')
  @Organaizer()
  findOne(@Param('id') id: string) {
    return this.formSectionService.findOne(id);
  }

  @Get(':id/fields')
  @Organaizer()
  getFields(@Param('id') id: string) {
    return this.formSectionService.getFields(id);
  }
  @Post(':eventId/:fieldId')
  @Organaizer()
  addFieldToFormSection(
    @Param('eventId') eventId: string,
    @Param('fieldId') fieldId: string,
  ) {
    return this.formSectionService.addFieldToFormSection(eventId, fieldId);
  }
  @Get('event/:eventId')
  @Organaizer()
  getFormSectionsByEventId(@Param('eventId') eventId: string) {
    return this.formSectionService.getFormSectionsByEventId(eventId);
  }
  @Get('event/:eventId/choices')
  getChoicesByEventId(@Param('eventId') eventId: string) {
    return this.formSectionService.getChoicesByEventId(eventId);
  }
  @Get('event/:eventId/fields')
  getFieldsByEventId(@Param('eventId') eventId: string) {
    return this.formSectionService.getFieldsByEventId(eventId, null);
  }
  @Get('event/:eventId/fields/:participationId')
  getFieldsByEventIdAndParticipantID(
    @Param('eventId') eventId: string,
    @Param('participationId') participationId: string,
  ) {
    return this.formSectionService.getFieldsByEventId(eventId, participationId);
  }

  @Post()
  @Organaizer()
  create(@Body() createFormSectionDto: CreateFormSectionDto) {
    return this.formSectionService.create(createFormSectionDto);
  }
}
