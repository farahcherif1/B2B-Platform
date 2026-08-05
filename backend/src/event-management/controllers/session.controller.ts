import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { CreateSessionDto } from '../dtos/session-dto/create-session.dto';
import { UpdateSessionDto } from '../dtos/session-dto/update-session.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }
  @Get(':eventId')
  findAllByEvent(@Param('eventId') eventId: string) {
    return this.sessionService.findAllByEvent(eventId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
