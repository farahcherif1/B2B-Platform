import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDto } from '../dtos/event-dto/create-event.dto';
import { UpdateEventDto } from '../dtos/event-dto/update-event.dto';
import { CreateFilterDto } from '../dtos/event-dto/create-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Organaizer } from 'src/auth/core/decorators/organizer.decorator';
import { GetUser } from 'src/auth/core/decorators/get-user.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard())
  @Organaizer()
  @Post()
  create(@Body() createEventDto: CreateEventDto, @GetUser() user) {
    return this.eventService.create(createEventDto, user.userId);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  find(@Query() filter: CreateFilterDto) {
    return this.eventService.find(filter);
  }

  @Get('/organizer')
  @UseGuards(AuthGuard())
  @Organaizer()
  @UsePipes(new ValidationPipe({ transform: true }))
  getOrganizerEvents(@GetUser() user, @Query() filter: CreateFilterDto) {
    return this.eventService.getOrganizerEvents(user.userId, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
