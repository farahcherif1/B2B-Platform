import { Meeting } from './meeting.entity';
import { Session } from './session.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Interval {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  start: Date;
  @Column({ nullable: true })
  end: Date;
  @ManyToOne(() => Session, (session) => session.intervals)
  session: Session;

  @OneToMany(() => Meeting, (meeting) => meeting.interval)
  meetings: Meeting[];
}
