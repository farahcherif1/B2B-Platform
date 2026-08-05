import { User } from 'src/user-management/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  token: string;

  @Column()
  validity: string;

  @Column({ default: false })
  is_expired: boolean;

  @Column()
  expired_date: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
