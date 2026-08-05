import { UserRole } from 'src/user-management/entities/user-role.entity';
import { Token } from 'src/auth/entities/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Application } from 'src/application-management/entities/application.entity';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { Meeting } from 'src/event-management/entities/meeting.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @Column({
    type: 'boolean',
    default: false,
  })
  is_organizer: boolean;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @ManyToMany(() => TypeParticipant, (typeParticipant) => typeParticipant.users)
  typeParticipants: TypeParticipant[];

  @Column({ nullable: true })
  Pays?: string;

  @Column({ nullable: true })
  createdAt?: Date;

  @OneToMany(() => Meeting, (meeting) => meeting.Host)
  hostMeetings: Meeting[];
  @OneToMany(() => Meeting, (meeting) => meeting.Gest)
  gestMeetings: Meeting[];
}
