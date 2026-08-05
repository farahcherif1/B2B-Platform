import { Event } from 'src/event-management/entities/event.entity';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import { User } from 'src/user-management/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('application_relation')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn()
  user?: User;

  @ManyToOne(() => Event, (event) => event.applications)
  @JoinColumn()
  event?: Event;

  @ManyToOne(
    () => TypeParticipant,
    (typeParticipant) => typeParticipant.applications,
  )
  @JoinColumn()
  ParticipationType?: TypeParticipant;

  @Column({ nullable: true })
  FirstName?: string;

  @Column({ nullable: true })
  LastName?: string;

  @Column({ nullable: true })
  Function?: string;

  @Column({ nullable: true })
  PhoneNumber?: string;

  @Column({ nullable: true })
  ProfilePicture?: string;

  @Column({ nullable: true })
  OrganisationName?: string;

  @Column({ nullable: true })
  OrganisationType?: string;

  @Column({ nullable: true })
  OrganisationPhoneNumber?: string;

  @Column({ nullable: true })
  OrganisationDescription?: string;

  @Column({ nullable: true })
  OrganisationWebsite?: string;

  @Column({ nullable: true })
  OrganisationLogo?: string;

  @Column({ nullable: true })
  OrganisationProduct?: string;

  @Column({ nullable: true })
  Linkedin?: string;

  @Column({ nullable: true })
  Facebook?: string;

  @Column({ nullable: true })
  X?: string;

  @Column({ nullable: true })
  Instagram?: string;

  @Column({ nullable: true })
  pays?: string;

  @Column({ nullable: true })
  Departement?: string;

  @Column({ nullable: true })
  Ville?: string;

  @Column({ nullable: true })
  CodePostal?: number;

  @Column({ nullable: true })
  Adresse?: string;

  @Column({ nullable: true })
  currentStep?: number;

  @Column({ nullable: true })
  DateInscription?: Date;

  @Column({ nullable: true })
  Questions?: string;
}
