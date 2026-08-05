import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../event-management/entities/event.entity';
@Entity('topic')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column()
  name: string;
  @ManyToMany(() => Event, (event) => event.topics, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  events?: Event[];
}
