import { Event } from './event.entity';
import { Meeting } from './meeting.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => Event, (event) => event.locations)
  event: Event;

  @OneToMany(() => Meeting, (meeting) => meeting.location)
  meetings: Meeting[];
}
