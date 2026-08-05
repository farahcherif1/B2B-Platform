import { Module } from '@nestjs/common';
import { MeetingService } from './services/meeting.service';
import { MeetingController } from './controllers/meeting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { User } from 'src/user-management/entities/user.entity';
import { Location } from 'src/event-management/entities/location.entity';
import { Session } from 'src/event-management/entities/session.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Application } from 'src/application-management/entities/application.entity';
import { Interval } from 'src/event-management/entities/interval.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meeting,
      User,
      Location,
      Session,
      Event,
      Application,
      Interval,
    ]),
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
