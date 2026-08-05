import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Interval } from 'src/interval/entities/interval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Event, Meeting, Interval])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
