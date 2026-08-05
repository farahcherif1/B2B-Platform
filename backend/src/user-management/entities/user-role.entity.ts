import { Role } from 'src/user-management/entities/role.entity';
import { User } from 'src/user-management/entities/user.entity';
import { Event } from 'src/event-management/entities/event.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn()
  user: User;
  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Event, (event) => event.userRoles)
  @JoinColumn()
  event: Event;
}
