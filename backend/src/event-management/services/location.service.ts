import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../dtos/location-dto/create-location.dto';
import { UpdateLocationDto } from '../dtos/location-dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/event-management/entities/event.entity';
import { Meeting } from 'src/event-management/entities/meeting.entity';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    let event = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.id = :id', { id: createLocationDto.event })
      .getOne();
    if (!event) {
      throw new Error('Event not found');
    }
    let meetings = [];
    if (createLocationDto.meetings) {
      meetings = await this.meetingRepository
        .createQueryBuilder('meeting')
        .where('meeting.id IN (:...ids)', {
          ids: createLocationDto.meetings,
        })
        .getMany();
      if (meetings.length !== createLocationDto.meetings.length) {
        throw new Error('Some meetings not found');
      }
    }
    let location = this.locationRepository.create({
      ...createLocationDto,
      event: event,
      meetings: meetings,
    });
    location = await this.locationRepository.save(location);
    return location;
  }
  findAllByEvent(eventId: string) {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.event', 'event')
      .where('event.id = :id', { id: eventId })
      .getMany();
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: string) {
    return `This action returns a #${id} location`;
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: string) {
    return `This action removes a #${id} location`;
  }
}
