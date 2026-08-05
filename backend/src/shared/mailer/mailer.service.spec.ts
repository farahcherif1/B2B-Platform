import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';

jest.mock('nodemailer');

describe('MailerService', () => {
  let service: MailerService;
  let transportMock: nodemailer.Transporter;

  beforeEach(async () => {
    transportMock = {
      sendMail: jest.fn().mockResolvedValue('Email sent'),
    } as any;
    (nodemailer.createTransport as jest.Mock).mockReturnValue(transportMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'MAIL_HOST':
                  return 'smtp.example.com';
                case 'MAIL_PORT':
                  return 587;
                case 'MAIL_USER':
                  return 'user@example.com';
                case 'MAIL_PASSWORD':
                  return 'password';
                case 'APP_NAME':
                  return 'TestApp';
                case 'DEFAULT_MAIL_FROM':
                  return 'noreply@example.com';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email', async () => {
    const sendEmailDto: SendEmailDto = {
      from: {
        name: 'Sender Name',
        address: 'sender@gmail.com',
      },
      recipients: [
        {
          name: 'Recipient Name',
          address: 'recipient@gmail.com',
        },
      ],
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    };

    const result = await service.sendEmail(sendEmailDto);

    expect(transportMock.sendMail).toHaveBeenCalledWith({
      from: {
        name: 'Sender Name',
        address: 'sender@gmail.com',
      },
      to: [
        {
          name: 'Recipient Name',
          address: 'recipient@gmail.com',
        },
      ],
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    });
    expect(result).toBe('Email sent');
  });
});
