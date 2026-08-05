import { Event } from 'src/event-management/entities/event.entity';
import { Field } from 'src/application-management/entities/field.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FormSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Field, (field) => field.formSection)
  fields: Field[];

  @OneToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn()
  event: Event;
}
