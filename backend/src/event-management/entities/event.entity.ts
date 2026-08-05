import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timezone } from '../../shared/types/timezone';

import { Topic } from 'src/core-options/entities/topic.entity';
import { Language } from 'src/core-options/entities/language.entity';
import { Country } from 'src/core-options/entities/country.entity';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import { Application } from 'src/application-management/entities/application.entity';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { FormSection } from 'src/application-management/entities/form-section.entity';
import { Session } from './session.entity';
import { Location } from './location.entity';
import { Meeting } from './meeting.entity';
import { WebsiteTab } from 'src/website/entities/website-tab.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Topic, (topic) => topic.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'event_topic',
    joinColumn: {
      name: 'id_event',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_topic',
      referencedColumnName: 'id',
    },
  })
  topics?: Topic[];
  @ManyToMany(() => Language, (language) => language.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'event_language',
    joinColumn: {
      name: 'id_event',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_language',
      referencedColumnName: 'id',
    },
  })
  languages?: Language[];

  @Column({ name: 'startDate' })
  startDate: Date;
  @Column({ name: 'endDate' })
  endDate: Date;
  @Column({ nullable: true })
  timezone?: Timezone;
  @Column()
  registrations: number;
  @OneToMany(() => Meeting, (meeting) => meeting.event)
  meetings: Meeting[];
  @Column()
  state: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'id_country' })
  country: Country;

  @Column()
  paid: boolean;
  @Column()
  price?: number;
  @Column()
  type?: string;

  @OneToMany(() => UserRole, (userRole) => userRole.event)
  userRoles?: UserRole[];

  @OneToMany(() => Application, (application) => application.event)
  applications?: Application[];

  @OneToMany(() => TypeParticipant, (typeParticipant) => typeParticipant.event)
  typeParticipants?: TypeParticipant[];

  @OneToOne(() => FormSection, (formSection) => formSection.event)
  formSection?: FormSection;

  @OneToMany(() => Session, (session) => session.event)
  sessions?: Session[];

  @OneToMany(() => Location, (location) => location.event)
  locations?: Location[];

 // Inside the Event entity

 @OneToMany(() => WebsiteTab, (websiteTab) => websiteTab.event, {
  cascade: ['insert', 'update'],
  })
  websiteTabs: WebsiteTab[];


}
