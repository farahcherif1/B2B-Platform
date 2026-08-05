import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { MeetingService } from '../services/meeting.service';
import { CreateMeetingDto } from '../dtos/meeting-dto/create-meeting.dto';
import { UpdateMeetingDto } from '../dtos/meeting-dto/update-meeting.dto';
import { FilterDto } from '../dtos/meeting-dto/filter.dto';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.create(createMeetingDto);
  }

  @Get()
  findAll(@Query() filter: FilterDto) {
    return this.meetingService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingService.update(id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingService.remove(id);
  }
}
