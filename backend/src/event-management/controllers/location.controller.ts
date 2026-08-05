import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDto } from '../dtos/location-dto/create-location.dto';
import { UpdateLocationDto } from '../dtos/location-dto/update-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }
  @Get('/:eventId')
  findAllByEvent(@Param('eventId') eventId: string) {
    return this.locationService.findAllByEvent(eventId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}
