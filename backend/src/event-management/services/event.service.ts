import { Injectable } from '@nestjs/common';
import { CreateEventDto } from '../dtos/event-dto/create-event.dto';
import { UpdateEventDto } from '../dtos/event-dto/update-event.dto';
import { Event } from '../entities/event.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/core-options/entities/topic.entity';
import { Language } from 'src/core-options/entities/language.entity';
import { CreateFilterDto } from '../dtos/event-dto/create-filter.dto';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import { User } from 'src/user-management/entities/user.entity';
import { Role } from 'src/user-management/entities/role.entity';
import { WebsiteTab } from 'src/website/entities/website-tab.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(WebsiteTab)
    private websiteTabRepository: Repository<WebsiteTab>,
  ) {}

  async create(createEventDto: CreateEventDto, id: string): Promise<Event> {
    const topic = await this.topicRepository.find({
      where: {
        name: createEventDto['topics'],
      },
    });
    const language = await this.languageRepository.find({
      where: {
        name: createEventDto['languages'],
      },
    });
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    let event = this.eventRepository.create({
      ...createEventDto,
      topics: topic,
      languages: language,
    });
    const role = await this.roleRepository.findOne({
      where: {
        name: 'OWNER',
      },
    });

    event = await this.eventRepository.save(event);
    
    // Create default website tabs
    const websiteTabNames = ['INFO', 'HOW IT WORKS', 'FAQ', 'CONTACT'];
    const websiteTabs = websiteTabNames.map(name => {
      return this.websiteTabRepository.create({
        name,
        eventId: event.id,
        event: { id: event.id }
      });
    });
    
    await this.websiteTabRepository.save(websiteTabs);

    const userRole = this.userRoleRepository.create({
      user: { id: user.id },
      role: { id: role.id },
      event: { id: event.id },
    });
    await this.userRoleRepository.save(userRole);
    return event;
  }

  async find(filter: CreateFilterDto) {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.topics', 'topic')
      .innerJoinAndSelect('event.languages', 'language');
    const filterConditions = {
      'event.name LIKE :searchQuery': filter.searchQuery
        ? `%${filter.searchQuery}%`
        : null,
      'topic.name IN (:...topics)': filter.topics,
      'language.name IN (:...languages)': filter.languages,
      'event.startDate >= :startDate': filter.startDate,
      'event.startDate <= :endDate': filter.endDate,
      'event.timezone = :timezone': filter.timezone,
      'event.registrations = :registrations': filter.registrations,
      'event.state = :state': filter.state,
      'event.paid = :paid': filter.paid,
      'event.price = :price': filter.price,
      'event.type IN (:...type)': filter.type,
    };
    Object.entries(filterConditions).forEach(([condition, value]) => {
      if (value !== null && value !== undefined) {
        query.andWhere(condition, {
          [condition
            .split(' ')
            .reverse()[0]
            .replace(':', '')
            .replace('...', '')
            .replace('(', '')
            .replace(')', '')]: value,
        });
      }
    });
    const total = await query.getCount();
    const events = await query
      .orderBy('event.startDate', 'ASC')
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getMany();
    return {
      data: events,
      meta: {
        total: total,
        totalPages: Math.ceil(total / filter.limit),
        page: filter.page,
      },
    };
  }

  findOne(id: string): Promise<Event> {
    return this.eventRepository.findOne({
      where: {
        id: id,
      },
      relations: ['topics', 'languages', 'websiteTabs'],
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventRepository.update(id, updateEventDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.eventRepository.delete(id);
  }

  async getOrganizerEvents(id: string, filter: CreateFilterDto) {
    const query = this.userRoleRepository
      .createQueryBuilder('userRole')
      .innerJoinAndSelect('userRole.user', 'user')
      .innerJoinAndSelect('userRole.role', 'role')
      .innerJoinAndSelect('userRole.event', 'event')
      .where('user.id = :id', { id: id })
      .andWhere('role.is_organizer_role = :is_organizer_role', {
        is_organizer_role: true,
      });
    const total = await query.getCount();
    const events = await query
      .orderBy('event.startDate', 'ASC')
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getMany()
      .then((userRoles) => userRoles.map((userRole) => userRole.event));
    return {
      data: events,
      meta: {
        total: total,
        totalPages: Math.ceil(total / filter.limit),
        page: filter.page,
      },
    };
  }
}