import { Status } from 'src/shared/enum/Status.enum';
import { Event } from './event.entity';
import { Interval } from 'src/event-management/entities/interval.entity';
import { Location } from 'src/event-management/entities/location.entity';
import { Session } from './session.entity';
import { User } from 'src/user-management/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.hostMeetings)
  Host: User;
  @ManyToOne(() => User, (user) => user.gestMeetings)
  Gest: User;

  @ManyToOne(() => Interval, (interval) => interval.meetings)
  interval: Interval;

  @ManyToOne(() => Session, (session) => session.meetings)
  session: Session;

  @ManyToOne(() => Location, (location) => location.meetings)
  location: Location;
  @ManyToOne(() => Event, (event) => event.meetings)
  event: Event;
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;
}
