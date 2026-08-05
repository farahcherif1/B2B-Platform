import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/user-dto/create-user.dto';
import { UpdateUserDto } from '../dtos/user-dto/update-user.dto';
import { RoleService } from './role.service';
import { UserRoleService } from './user-role.service';
import { EventService } from 'src/event-management/services/event.service';
import { Application } from 'src/application-management/entities/application.entity';
import { CreateFilterDto } from '../dtos/user-dto/create-filter.dto';
import { Role } from 'src/user-management/entities/role.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/shared/mailer/mailer.service';

import { UserRole } from 'src/user-management/entities/user-role.entity';
import { SendEmailDto } from 'src/shared/mailer/dto/send-email.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { UserDto } from '../dtos/user-dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly mailerService: MailerService,
    private roleservice: RoleService,
    private eventService: EventService,
    private readonly configService: ConfigService,
  ) {}
  readonly mailer = this.configService.get<string>('MAIL_SENDER');
  readonly mailer_name = this.configService.get<string>('MAIL_SENDER_NAME');
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.createdAt = new Date();
    //TO FIX
    if (user.Pays == null) {
      user.Pays = 'Tunisie';
    }
    return await this.userRepository.save(user);
  }
  async createOrganizer(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.is_organizer = true;
    user.createdAt = new Date();
    // TO FIX
    if (user.Pays == null) {
      user.Pays = 'Tunisie';
    }
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['userRoles'],
    });
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async assignRoleToUser(
    userId: string,
    roleId: string,
    eventId: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const role = await this.roleservice.findOne(roleId);
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
    }

    const event = await this.eventService.findOne(eventId);
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.save(user);
  }
  async getOrganizers(eventId: string, filter: CreateFilterDto) {
    const QueryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .leftJoinAndSelect('userRoles.event', 'event')
      .where('event.id = :eventId', { eventId: eventId })
      .andWhere('role.is_organizer_role = :is_organizer_role', {
        is_organizer_role: true,
      });

    if (filter.searchQuery) {
      QueryBuilder.andWhere('user.name LIKE :searchQuery', {
        searchQuery: `%${filter.searchQuery}%`,
      });
    }
    if (filter.createDate) {
      QueryBuilder.andWhere('user.createdAt = :createDate', {
        createDate: filter.createDate,
      });
    }
    if (filter.role && filter.role != 'All') {
      QueryBuilder.andWhere('role.name = :role', { role: filter.role });
    }
    if (filter.Pays && filter.Pays != 'All') {
      QueryBuilder.andWhere('user.Pays = :Pays', { Pays: filter.Pays });
    }
    const total = await QueryBuilder.getCount();

    QueryBuilder.orderBy('user.createdAt', 'DESC');
    QueryBuilder.skip((filter.page - 1) * filter.limit);
    QueryBuilder.take(filter.limit);

    const organizers = await QueryBuilder.getMany();
    organizers.forEach((organizer) => {
      organizer.password = undefined;
    });
    return {
      data: organizers,
      meta: {
        total: total,
        totalPages: Math.ceil(total / filter.limit),
        page: filter.page,
      },
    };
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async deleteOrganizer(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.delete(id);
  }

  async getUsers(idEvent: string, searchQuery: string): Promise<UserDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.applications', 'application')
      .leftJoinAndSelect('application.event', 'event')
      .where('user.name LIKE :searchQuery', {
        searchQuery: searchQuery ? `%${searchQuery}%` : '%%',
      })
      .andWhere('event.id = :eventId', {
        eventId: idEvent,
      })
      .getMany();
    let usersDto = [];
    users.forEach((user) => {
      let userDto = new UserDto();
      userDto.id = user.id;
      userDto.name = user.name;
      userDto.email = user.email;
      userDto.Function = user.applications[0].Function;
      userDto.Company = user.applications[0].OrganisationName;
      usersDto.push(userDto);
    });

    return usersDto;
  }
}
