import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../event-management/entities/event.entity';
@Entity('language')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column()
  name: string;
  @ManyToMany(() => Event, (event) => event.languages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  events?: Event[];
}
