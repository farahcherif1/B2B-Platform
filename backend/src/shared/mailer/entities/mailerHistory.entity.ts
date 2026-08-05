import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class MailerHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  from?: string;

  @Column({ type: 'simple-json', nullable: true })
  participantTypes: { id: string, name: string }[];

  @Column({ type: 'text', nullable: false })
  recipients: string;

  @Column({ nullable: true})
  eventId: string;


  @Column({ type: 'text', nullable: false })
  subject: string;

  @Column({ type: 'text', nullable: false })
  html: string;

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'scheduled' | 'sent' | 'failed';

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sendAt?: Date;
}
