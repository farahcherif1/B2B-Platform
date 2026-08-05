import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerHistory } from './entities/mailerHistory.entity';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/send-email.dto';
import { Organaizer } from 'src/auth/core/decorators/organizer.decorator';

@Controller('mailer')
export class MailerController {
  constructor(
    @InjectRepository(MailerHistory)
    private readonly mailerHistoryRepository: Repository<MailerHistory>,
    private readonly mailerService: MailerService,
  ) {}

  @Organaizer()
  @Get('history')
  async getEmailHistory() {
    return this.mailerHistoryRepository.find({ order: { createdAt: 'DESC' } });
  }

  @Organaizer()
  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.mailerService.sendEmail(sendEmailDto);
  }
}
