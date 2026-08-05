import { Module } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { SessionController } from './controllers/session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Meeting } from 'src/event-management/entities/meeting.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Interval } from 'src/event-management/entities/interval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Event, Meeting, Interval])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
