import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MailerHistory } from './entities/mailerHistory.entity';
import { SendEmailDto } from './dto/send-email.dto';
import { Application } from 'src/application-management/entities/application.entity';

@Injectable()
export class MailerService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(MailerHistory)
    private readonly mailerHistoryRepo: Repository<MailerHistory>,

    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  private mailTransport() {
    return nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(dto: SendEmailDto) {
    console.log('▶ DTO:', dto);

    let recipients: string[] = [];

    if (dto.participantTypes?.length) {
      const typeIds = dto.participantTypes.map(pt => String(pt.id));
      // Convert eventId to string if it's not already
      const eventIdStr = String(dto.eventId);

      const allApps = await this.applicationRepo.find({
        where: { event: { id: eventIdStr } },
        relations: ['user', 'ParticipationType', 'event'],
      });

      const apps = await this.applicationRepo.find({
        where: {
          event: { id: eventIdStr },
          ParticipationType: { id: In(typeIds) },
        },
        relations: ['user', 'ParticipationType'],
      });

      const applications = await this.applicationRepo.find({
        where: {
          event: { id: eventIdStr },
          ParticipationType: { id: In(typeIds) },
        },
        relations: ['user'],
      });

      applications.forEach(app => {
        const email = app.user?.email || (app as any).email;
        if (email?.trim()) recipients.push(email.trim());
      });
      recipients = Array.from(new Set(recipients));
    }
    else if (dto.recipients?.length) {
      recipients = dto.recipients.map(r => r.address);
    }

    if (recipients.length === 0) {
      throw new BadRequestException(
        'No participant email addresses found for the selected types.'
      );
    }
    // Convert eventId to string if it's not already
    const eventIdStr = String(dto.eventId);

    const history = new MailerHistory();
    history.recipients = recipients.join(', ');
    history.subject = dto.subject;
    history.html = dto.html;
    history.text = dto.text;
    history.status = dto.sendAt ? 'scheduled' : 'pending';
    history.sendAt = dto.sendAt;
    history.eventId = eventIdStr;
    history.from = typeof dto.from === 'object' ? dto.from.address : dto.from;
    history.participantTypes = dto.participantTypes ? dto.participantTypes.map(pt => ({
      id: String(pt.id),
      name: pt.name,
    })) : [];

    const saved = await this.mailerHistoryRepo.save(history);

    if (dto.sendAt) {
      const delay = new Date(dto.sendAt).getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => this.sendMail(saved), delay);
      }
    } else {
      await this.sendMail(saved);
    }

    return saved;
  }

  private async sendMail(emailHistory: MailerHistory) {
    const transport = this.mailTransport();
    try {
      await transport.sendMail({
        from: emailHistory.from || this.configService.get('DEFAULT_MAIL_FROM'),
        to: emailHistory.recipients.split(',').map(a => a.trim()),
        subject: emailHistory.subject,
        html: emailHistory.html,
        text: emailHistory.text,
      });
      emailHistory.status = 'sent';
    } catch (err) {
      console.error('Email send error', err);
      emailHistory.status = 'failed';
    }
    await this.mailerHistoryRepo.save(emailHistory);
  }
}
