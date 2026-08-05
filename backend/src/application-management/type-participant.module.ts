import { Module } from '@nestjs/common';
import { TypeParticipantService } from './services/type-participant.service';
import { TypeParticipantController } from './controllers/type-participant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeParticipant } from './entities/type-participant.entity';
import { User } from 'src/user-management/entities/user.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Application } from 'src/application-management/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeParticipant, Event, User, Application]),
  ],
  controllers: [TypeParticipantController],
  providers: [TypeParticipantService],
})
export class TypeParticipantModule {}
