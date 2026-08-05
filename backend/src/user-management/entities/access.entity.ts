import { Role } from 'src/user-management/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class Access {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.accesses)
  roles: Role[];
}
