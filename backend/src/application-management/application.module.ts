import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controllers/application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { User } from 'src/user-management/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Event } from 'src/event-management/entities/event.entity';
import { JwtService } from '@nestjs/jwt';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import { MailerHistory } from 'src/shared/mailer/entities/mailerHistory.entity';
import { S3Service } from 'src/shared/s3/s3.service';
import { TypeParticipantService } from 'src/application-management/services/type-participant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      User,
      Event,
      TypeParticipant,
      UserRole,
      MailerHistory,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, JwtService, MailerService,TypeParticipantService, S3Service],
})
export class ApplicationModule {}
