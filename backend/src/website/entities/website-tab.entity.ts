import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../event-management/entities/event.entity';
import { Section } from './section.entity';

@Entity()
export class WebsiteTab {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Event, (event) => event.websiteTabs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' }) // this creates a foreign key column `eventId`
  event: Event;

  @Column()
  eventId: string;

  @OneToMany(() => Section, (section) => section.websiteTab, {
    cascade: ['insert', 'update'],
  })
  sections: Section[];
}
