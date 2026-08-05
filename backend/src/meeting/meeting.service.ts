import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user-management/entities/user.entity';
import { Session } from 'src/session/entities/session.entity';
import { Location } from 'src/location/entities/location.entity';
import { FilterDto } from './dto/filter.dto';
import { Event } from 'src/event-management/entities/event.entity';
import { Application } from 'src/application-management/entities/application.entity';
import { Status } from 'src/shared/enum/Status.enum';
import { Interval } from 'src/interval/entities/interval.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Interval)
    private intervalRepository: Repository<Interval>,
  ) {}
  async create(createMeetingDto: CreateMeetingDto) {
    const host = await this.userRepository.findOne({
      where: { id: createMeetingDto.hostId },
    });
    const guest = await this.userRepository.findOne({
      where: { id: createMeetingDto.guestId },
    });
    const session = await this.sessionRepository.findOne({
      where: { id: createMeetingDto.sessionId },
    });
    const interval = await this.intervalRepository.findOne({
      where: { id: createMeetingDto.intervalId },
    });
    const location = await this.locationRepository.findOne({
      where: { id: createMeetingDto.locationId },
    });
    const event = await this.eventRepository.findOne({
      where: { id: createMeetingDto.eventId },
    });

    if (!host || !guest || !interval || !location || !event || !session) {
      throw new Error('Invalid data');
    }
    if (host.id === guest.id) {
      throw new Error('Host and guest cannot be the same');
    }
    const reservedIntervals = await this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.interval', 'interval')
      .leftJoinAndSelect('meeting.session', 'session')
      .leftJoinAndSelect('meeting.Host', 'host')
      .leftJoinAndSelect('meeting.Gest', 'guest')
      .where('interval.id = :intervalId', { intervalId: interval.id })
      .andWhere('meeting.status != :status', {
        status: Status.CANCELLED,
      })
      .andWhere('meeting.session = :sessionId', {
        sessionId: session.id,
      })
      .andWhere('(host.id In (:...Ids) OR guest.id In (:...Ids)) ', {
        Ids: [host.id, guest.id],
      })
      .getMany();
    if (reservedIntervals.length > 0) {
      throw new HttpException('Interval reserved', HttpStatus.BAD_REQUEST);
    }
    host.password = undefined;
    guest.password = undefined;
    let meeting = this.meetingRepository.create({
      Host: host,
      Gest: guest,
      interval: interval,
      location: location,
      event: event,
      session: session,
    });
    meeting = await this.meetingRepository.save(meeting);
    return meeting;
  }

  async findAll(filter: FilterDto) {
    let query = this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.Host', 'host')
      .leftJoinAndSelect('meeting.Gest', 'gest')
      .leftJoinAndSelect('meeting.interval', 'interval')
      .leftJoinAndSelect('meeting.session', 'session')
      .leftJoinAndSelect('meeting.location', 'location')
      .leftJoinAndSelect('meeting.event', 'event')
      .leftJoinAndSelect('host.applications', 'hostApplications')
      .leftJoinAndSelect('gest.applications', 'guestApplications')
      .where(
        'meeting.event = :eventId AND hostApplications.event = :eventId AND guestApplications.event = :eventId',
        {
          eventId: filter.eventId,
        },
      );

    query.andWhere(
      '(host.name LIKE :searchQuery OR gest.name LIKE :searchQuery)',
      {
        searchQuery: `%${filter.searchQuery ? filter.searchQuery : ''}%`,
      },
    );
    if (filter.sessionId) {
      query.andWhere('session.id = :sessionId', {
        sessionId: filter.sessionId,
      });
    }
    if (filter.intervalId) {
      query.andWhere('interval.id = :intervalId', {
        intervalId: filter.intervalId,
      });
    }

    if (filter.locationId) {
      query.andWhere('location.id = :locationId', {
        locationId: filter.locationId,
      });
    }
    if (filter.startDate) {
      const filterDate = new Date(filter.startDate);

      const startOfDay = new Date(
        Date.UTC(
          filterDate.getUTCFullYear(),
          filterDate.getUTCMonth(),
          filterDate.getUTCDate(),
          0,
          0,
          0,
          0,
        ),
      );

      const endOfDay = new Date(
        Date.UTC(
          filterDate.getUTCFullYear(),
          filterDate.getUTCMonth(),
          filterDate.getUTCDate() + 1,
          0,
          0,
          0,
          0,
        ),
      );

      query.andWhere(
        'session.startTime >= :startOfDay AND session.startTime < :endOfDay',
        { startOfDay, endOfDay },
      );
    }
    let confirmedQuery = query.clone();
    let confirmedCount = await confirmedQuery
      .andWhere('meeting.status = :status', {
        status: Status.CONFIRMED,
      })
      .getCount();
    let pendingQuery = query.clone();
    let pendingCount = await pendingQuery
      .andWhere('meeting.status = :status', {
        status: Status.PENDING,
      })
      .getCount();
    let CanceledQuery = query.clone();
    let CanceledCount = await CanceledQuery.andWhere(
      'meeting.status = :status',
      {
        status: Status.CANCELLED,
      },
    ).getCount();
    let completedQuery = query.clone();
    let completedCount = await completedQuery
      .andWhere('meeting.status = :status', {
        status: Status.COMPLETED,
      })
      .getCount();
    const total = await query.getCount();

    if (filter.status) {
      query.andWhere('meeting.status = :status', {
        status: filter.status,
      });
    }

    if (!filter.page) filter.page = 1;
    if (!filter.limit) filter.limit = 3;
    const meetings = await query
      .orderBy('event.startDate', 'ASC')
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getMany();
    meetings.forEach((meeting) => {
      meeting.Host.password = undefined;
      meeting.Gest.password = undefined;
    });
    return {
      data: meetings,
      meta: {
        total: total,
        totalPages: Math.ceil(total / filter.limit),
        page: filter.page,
        confirmedCount: confirmedCount,
        pendingCount: pendingCount,
        canceledCount: CanceledCount,
        completedCount: completedCount,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return this.meetingRepository.update(id, updateMeetingDto);
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
