import { Application } from 'src/application-management/entities/application.entity';
import { Event } from 'src/event-management/entities/event.entity';
import { Field } from 'src/application-management/entities/field.entity';
import { User } from 'src/user-management/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('type_participant')
export class TypeParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.typeParticipants)
  @JoinColumn()
  event?: Event;

  @ManyToMany(() => User, (user) => user.typeParticipants)
  @JoinTable({
    name: 'user_type_participant',           // your join table
    joinColumn: {
      name: 'type_participant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users?: User[];

  @ManyToMany(
    () => TypeParticipant,
    (typeParticipant) => typeParticipant.relatedParticipants,
  )
  @JoinTable({
    name: 'type_participant_relations', // Custom join table name
    joinColumn: {
      name: 'type_participant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'related_type_participant_id',
      referencedColumnName: 'id',
    },
  })
  relatedParticipants?: TypeParticipant[];

  @ManyToMany(() => Field, (field) => field.participantsType)
  @JoinTable({
    // This side manages the relation table
    name: 'field_participant_type', // Custom join table name
    joinColumn: {
      name: 'type_participant_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'field_id',
      referencedColumnName: 'id',
    },
  })
  fields?: Field[];

  @OneToMany(() => Application, (application) => application.ParticipationType)
  applications?: Application[];
}
