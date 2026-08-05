import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IntervalService } from './interval.service';
import { CreateIntervalDto } from './dto/create-interval.dto';
import { UpdateIntervalDto } from './dto/update-interval.dto';

@Controller('interval')
export class IntervalController {
  constructor(private readonly intervalService: IntervalService) {}

  @Post()
  create(@Body() createIntervalDto: CreateIntervalDto) {
    return this.intervalService.create(createIntervalDto);
  }

  @Get()
  findAll() {
    return this.intervalService.findAll();
  }

  @Get(':id')
  findOneBySessionId(@Param('id') id: string) {
    return this.intervalService.findOneBySessionId(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntervalDto: UpdateIntervalDto,
  ) {
    return this.intervalService.update(+id, updateIntervalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intervalService.remove(+id);
  }
}
