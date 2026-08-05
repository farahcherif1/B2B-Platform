import { Event } from 'src/event-management/entities/event.entity';
import { Interval } from 'src/interval/entities/interval.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startTime: Date;
  @Column()
  endTime: Date;
  @ManyToOne(() => Event, (event) => event.sessions)
  event: Event;

  @OneToMany(() => Meeting, (meeting) => meeting.session)
  meetings: Meeting[];

  @OneToMany(() => Interval, (interval) => interval.session, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  intervals: Interval[];
}
