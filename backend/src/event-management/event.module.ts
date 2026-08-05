import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from 'src/user-management/entities/user.entity';
import { Language } from '../core-options/entities/language.entity';
import { Topic } from '../core-options/entities/topic.entity';
import { EventTopic } from './entities/eventTopic.entity';
import { EventLanguage } from './entities/eventLanguage.entity';
import { Country } from 'src/core-options/entities/country.entity';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Role } from 'src/user-management/entities/role.entity';
import { Application } from 'src/application-management/entities/application.entity';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { FormSection } from 'src/application-management/entities/form-section.entity';
import { WebsiteTab } from 'src/website/entities/website-tab.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      User,
      Language,
      Topic,
      EventTopic,
      EventLanguage,
      Country,
      UserRole,
      Role,
      Application,
      TypeParticipant,
      FormSection,
      WebsiteTab
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [EventController],
  providers: [EventService, JwtService],
  exports: [EventService],
})
export class EventModule {}
