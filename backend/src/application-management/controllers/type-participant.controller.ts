import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TypeParticipantService } from '../services/type-participant.service';
import { CreateTypeParticipantDto } from '../dtos/type-participant-dto/create-type-participant.dto';
import { UpdateTypeParticipantDto } from '../dtos/type-participant-dto/update-type-participant.dto';

@Controller('type-participant')
export class TypeParticipantController {
  constructor(
    private readonly typeParticipantService: TypeParticipantService,
  ) {}

  @Post()
  create(@Body() createTypeParticipantDto: CreateTypeParticipantDto) {
    return this.typeParticipantService.create(createTypeParticipantDto);
  }

  @Get()
  findAll() {
    return this.typeParticipantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeParticipantService.findOne(id);
  }

  @Get('/event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.typeParticipantService.findByEvent(eventId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTypeParticipantDto: UpdateTypeParticipantDto,
  ) {
    return this.typeParticipantService.update(id, updateTypeParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeParticipantService.remove(id);
  }
}
