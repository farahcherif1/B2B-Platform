import { Access } from 'src/user-management/entities/access.entity';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @ManyToMany(() => Access, (access) => access.roles)
  @JoinTable()
  accesses: Access[];

  @Column({
    type: 'boolean',
    default: false,
  })
  is_organizer_role: boolean;
}
