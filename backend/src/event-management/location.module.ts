import { Module } from '@nestjs/common';
import { LocationService } from './services/location.service';
import { LocationController } from './controllers/location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Meeting } from 'src/event-management/entities/meeting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Event, Meeting])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
