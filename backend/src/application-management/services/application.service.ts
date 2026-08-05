import { Inject, Injectable } from '@nestjs/common';
import { ApplicationPersonalInformationDto } from '../dtos/application-dto/ApplicationPersonalInformation.dto';
import { ApplicationOrganisationInformationDto } from '../dtos/application-dto/ApplicationOrganisationInformation.dto';
import { ApplicationAdressDto } from '../dtos/application-dto/ApplicationAdress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '../entities/application.entity';
import { QueryBuilder, Repository } from 'typeorm';
import { User } from 'src/user-management/entities/user.entity';
import { Event } from 'src/event-management/entities/event.entity';
import * as XLSX from 'xlsx';
import { application, Response } from 'express';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { getMetadataArgsStorage } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { getMetadataStorage } from 'class-validator';

import { MailerService } from 'src/shared/mailer/mailer.service';
import { S3Service } from 'src/shared/s3/s3.service';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(S3Service)
    private readonly s3Service: S3Service,

    private readonly mailerService: MailerService,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(TypeParticipant)
    private typeParticipantRepository: Repository<TypeParticipant>,
  ) {}

  async findAll() {
    return await this.applicationRepository.find();
  }

  async findOne(id: string) {
    return await this.applicationRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async remove(id: string) {
    return await this.applicationRepository.delete(id);
  }

  async getUserApplications(sub: string, id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: sub,
      },
    });
    const event = await this.eventRepository.findOne({
      where: {
        id: id,
      },
    });

    const application = await this.applicationRepository.findOne({
      where: {
        user: user,
        event: event,
      },
      relations: ['ParticipationType'],
    });
    if (!application) {
      return new Application();
    }

    return application;
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
  async createPersonnalInfo(
    id: string,
    applicationPersonalInformationDto: ApplicationPersonalInformationDto,
    sub: string,
  ) {
    let applicationPersonalInformationDto1 =
      new ApplicationPersonalInformationDto();
    const metadataStorage = getMetadataStorage();
    const validationMetadatas = metadataStorage.getTargetValidationMetadatas(
      ApplicationPersonalInformationDto,
      ApplicationPersonalInformationDto.name,
      false,
      false,
    );

    const propertyNames = [
      ...new Set(validationMetadatas.map((metadata) => metadata.propertyName)),
    ];

    propertyNames.forEach((key) => {
      applicationPersonalInformationDto1[key] =
        applicationPersonalInformationDto[key];
    });
    applicationPersonalInformationDto = {
      ...applicationPersonalInformationDto1,
    };
    let application = await this.getUserApplications(sub, id);

    let fileObject: Express.Multer.File = null;
    if (
      (applicationPersonalInformationDto.ProfilePicture &&
        applicationPersonalInformationDto.ProfilePicture.startsWith(
          'data:image/',
        )) ||
      (application &&
        application.ProfilePicture &&
        application.ProfilePicture.startsWith('data:image/'))
    ) {
      const dto = applicationPersonalInformationDto;
      const [header, data] = dto.ProfilePicture.split(';base64,');
      const mimeType = header.replace('data:', '');
      const buffer = Buffer.from(data, 'base64');

      fileObject = {
        fieldname: 'PictureFile',
        originalname: `profile-${Date.now()}`,
        encoding: '7bit',
        mimetype: mimeType,
        buffer: buffer,
        size: buffer.length,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };
    }

    const user = await this.userRepository.findOne({
      where: {
        id: sub,
      },
    });
    const event = await this.eventRepository.findOne({
      where: {
        id: id,
      },
    });
    // Convert ParticipationType to string if it's not already
    const participantTypeId = String(
      applicationPersonalInformationDto.ParticipationType,
    );
    const typeParticipant = await this.typeParticipantRepository.findOne({
      where: {
        id: participantTypeId,
      },
    });

    if (application.id == undefined) {
      if (fileObject) {
        const url = await this.s3Service.uploadFile(fileObject);
        applicationPersonalInformationDto.ProfilePicture = url;
      }
      application = this.applicationRepository.create({
        ...applicationPersonalInformationDto,
        user: user,
        event: event,
        ParticipationType: typeParticipant,
      });
      application.currentStep = 1;

      return await this.applicationRepository.save(application);
    }
    if (fileObject) {
      const url = await this.s3Service.uploadFile(fileObject);
      applicationPersonalInformationDto.ProfilePicture = url;
    }
    application = this.applicationRepository.create({
      ...application,
      ...applicationPersonalInformationDto,
      ParticipationType: typeParticipant,
    });

    application.currentStep = Math.max(1, application.currentStep);
    return await this.applicationRepository.update(application.id, application);
  }

  async createOrganisationInfo(
    id: string,
    applicationPersonalInformationDto: ApplicationOrganisationInformationDto,
    sub: string,
  ) {
    let applicationOrganisationInformationDto =
      new ApplicationOrganisationInformationDto();
    const metadataStorage = getMetadataStorage();
    const validationMetadatas = metadataStorage.getTargetValidationMetadatas(
      ApplicationOrganisationInformationDto,
      ApplicationOrganisationInformationDto.name,
      false,
      false,
    );

    const propertyNames = [
      ...new Set(validationMetadatas.map((metadata) => metadata.propertyName)),
    ];

    propertyNames.forEach((key) => {
      applicationOrganisationInformationDto[key] =
        applicationPersonalInformationDto[key];
    });
    let fileObject: Express.Multer.File = null;
    let application = await this.getUserApplications(sub, id);
    applicationPersonalInformationDto = {
      ...applicationOrganisationInformationDto,
    };
    if (
      applicationPersonalInformationDto.OrganisationLogo &&
      applicationPersonalInformationDto.OrganisationLogo.startsWith(
        'data:image/',
      )
    ) {
      const dto = applicationPersonalInformationDto;
      const [header, data] = dto.OrganisationLogo.split(';base64,');
      const mimeType = header.replace('data:', '');
      const buffer = Buffer.from(data, 'base64');

      fileObject = {
        fieldname: 'OrganisationLogo',
        originalname: `OrganisationLogo-${Date.now()}`,
        encoding: '7bit',
        mimetype: mimeType,
        buffer: buffer,
        size: buffer.length,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };
    }
    if (fileObject) {
      const url = await this.s3Service.uploadFile(fileObject);
      application.OrganisationLogo = url;
      applicationPersonalInformationDto.OrganisationLogo = url;
    }

    application = this.applicationRepository.create({
      ...application,
      ...applicationPersonalInformationDto,
    });

    application.currentStep = Math.max(2, application.currentStep);
    return await this.applicationRepository.update(application.id, application);
  }

  async createAddress(
    id: string,
    applicationPersonalInformationDto: ApplicationAdressDto,
    sub: string,
  ) {
    let applicationAdressDto = new ApplicationAdressDto();
    const metadataStorage = getMetadataStorage();
    const validationMetadatas = metadataStorage.getTargetValidationMetadatas(
      ApplicationAdressDto,
      ApplicationAdressDto.name,
      false,
      false,
    );

    const propertyNames = [
      ...new Set(validationMetadatas.map((metadata) => metadata.propertyName)),
    ];

    propertyNames.forEach((key) => {
      applicationAdressDto[key] = applicationPersonalInformationDto[key];
    });

    let application = await this.getUserApplications(sub, id);
    application = this.applicationRepository.create({
      ...application,
      ...applicationAdressDto,
    });
    application.currentStep = Math.max(3, application.currentStep);
    return await this.applicationRepository.update(application.id, application);
  }

  async addQuestions(id: string, questions: string, sub: string) {
    const application = await this.getUserApplications(sub, id);

    application.Questions = JSON.stringify(questions);

    await this.applicationRepository.save(application);
  }

  async createApplication(id: string, sub: string) {
    const application = await this.getUserApplications(sub, id);
    application.currentStep = 4;
    application.DateInscription = new Date();

    return await this.applicationRepository.update(application.id, application);
  }

  async getEventApplications(id: string, filter: any) {
    const QueryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.event', 'event')
      .where('event.id = :id', { id });
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
    const applications = await QueryBuilder.getMany();
    applications.forEach((application) => {
      application.user.password = undefined;
    });
    return {
      data: applications,
      meta: {
        total: total,
        totalPages: Math.ceil(total / filter.limit),
        page: filter.page,
      },
    };
  }

  async exportParticipants(participants: any[], res: Response) {
    try {
      const worksheet = XLSX.utils.json_to_sheet(participants);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="participants.xlsx"',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
    } catch (err) {
      console.log(err);
    }
  }

  async exportOrganizers(organizers: any[], res: Response) {
    try {
      const worksheet = XLSX.utils.json_to_sheet(organizers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'organizers');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="organizers.xlsx"',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
    } catch (err) {
      console.log(err);
    }
  }
  async importParticipants(file: Express.Multer.File, id: string) {
    try {
      const event = await this.eventRepository.findOne({
        where: {
          id: id,
        },
      });
      const applicationExistant = await this.applicationRepository
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.event', 'event')
        .leftJoinAndSelect('application.user', 'user')
        .where('event.id = :id', { id })
        .getMany();
      const emailsExistant = applicationExistant.map(
        (application) => application.user.email,
      );
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      const applicationKeys = getMetadataArgsStorage()
        .filterColumns(Application)
        .map((col) => col.propertyName);
      const emails = [];
      const participantUser = new Map();
      const participants = data.map((row) => {
        const application = new Application();
        Object.keys(row).forEach((key) => {
          if (applicationKeys.includes(key)) {
            application[key] = row[key];
          }
          if (key == 'UserEmail' && !emailsExistant.includes(row[key])) {
            emails.push(row[key]);
            participantUser.set(application, row[key]);
          }
        });
        return application;
      });
      if (emails.length == 0) {
        return;
      }
      const Query = this.userRepository.createQueryBuilder('user');
      Query.where('user.email IN (:...emails)', { emails });
      const users = await Query.getMany();
      const emailsFound = users.map((user) => user.email);
      const emailsNotFound = emails.filter(
        (email) => !emailsFound.includes(email),
      );
      const passwords = emailsNotFound.map((email) => {
        return crypto.randomBytes(20).toString('hex');
      });
      const hashedPasswords = [];
      for (let i = 0; i < passwords.length; i++) {
        hashedPasswords.push(await this.hashPassword(passwords[i]));
      }
      let emailsToPasswords = new Map();
      const usersToCreate = emailsNotFound.map((email) => {
        const user = new User();
        user.email = email;
        user.name = email.split('@')[0];
        user.is_organizer = false;
        user.createdAt = new Date();
        user.password = hashedPasswords[emailsNotFound.indexOf(email)];
        emailsToPasswords[email] = passwords[emailsNotFound.indexOf(email)];
        return user;
      });

      await this.userRepository.save(usersToCreate);
      const usersCreated = await Query.getMany();
      const applicationToCreate = [];
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        const user = usersCreated.find(
          (user) => user.email == participantUser.get(participant),
        );
        participant.user = user;
        participant.event = event;
        applicationToCreate.push(participant);
      }
      for (const [email, password] of emailsToPasswords) {
        const html = `<br><p>your email : ${email} <br>your password is ${password}</p>`;
        const dto = {
          recipients: [
            {
              name: email.split('@')[0],
              address: email,
            },
          ],
          subject: 'invitation event organizer',
          html,
        };
        await this.mailerService.sendEmail(dto);
      }
      return await this.applicationRepository.save(applicationToCreate);
    } catch (err) {
      console.log(err);
    }
  }
}
