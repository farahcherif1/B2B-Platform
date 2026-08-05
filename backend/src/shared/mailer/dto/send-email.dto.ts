import { Address } from 'nodemailer/lib/mailer';

export type SendEmailDto = {
  from?: Address;
  recipients?: Address[];
  participantTypes?: { id: number; name?: string }[];
  subject: string;
  html: string;
  text?: string;
  placeholderReplacement?: Record<string, string>;
  sendAt?: Date; 
  status?: 'pending' | 'scheduled' | 'sent' | 'failed'; 
  eventId?: number;
};
