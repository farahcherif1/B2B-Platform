import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Session } from './entities/session.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Interval } from 'src/interval/entities/interval.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Interval)
    private intervalRepository: Repository<Interval>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    let event = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.id = :id', { id: createSessionDto.event })
      .getOne();
    console.log('event is : ', event);
    if (!event) {
      throw new Error('Event not found');
    }
    let intervals = [];
    if (createSessionDto.intervals) {
      intervals = await this.intervalRepository
        .createQueryBuilder('interval')
        .where('interval.id IN (:...ids)', {
          ids: createSessionDto.intervals,
        })
        .getMany();
      if (intervals.length !== createSessionDto.intervals.length) {
        throw new Error('Some meetings not found');
      }
    }

    let session = this.sessionRepository.create({
      ...createSessionDto,
      event: event,
      intervals: intervals,
    });
    session = await this.sessionRepository.save(session);
    return session;
  }
  async findAllByEvent(eventId: number) {
    const sessions = await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.event', 'event')
      .leftJoinAndSelect('session.intervals', 'interval')
      .where('event.id = :id', { id: eventId })
      .getMany();
    sessions.forEach((session) => {
      session.event = undefined;
    });
    return sessions;
  }

  findAll() {
    return `This action returns all session`;
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
