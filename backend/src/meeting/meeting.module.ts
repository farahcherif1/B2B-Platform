import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { User } from 'src/user-management/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import { Session } from 'src/session/entities/session.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Application } from 'src/application-management/entities/application.entity';
import { Interval } from 'src/interval/entities/interval.entity';

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
