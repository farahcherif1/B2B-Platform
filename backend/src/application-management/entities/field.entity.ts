import { Choice } from 'src/core-options/entities/choice.entity';
import { FieldType } from 'src/shared/enum/FieldType';
import { FormSection } from 'src/application-management/entities/form-section.entity';
import { TypeParticipant } from 'src/application-management/entities/type-participant.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FieldDependency } from 'src/application-management/entities/field-dependency.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FieldType,
    default: FieldType.TEXT,
  })
  type: FieldType;

  @ManyToMany(
    () => TypeParticipant,
    (typeParticipant) => typeParticipant.fields,
  )
  participantsType: TypeParticipant[];

  @Column()
  required: boolean;

  @ManyToOne(() => Field, (field) => field.relatedFields, { nullable: true })
  relatedField: Field;

  @OneToMany(() => Field, (field) => field.relatedField)
  relatedFields: Field[];

  @OneToMany(() => Choice, (choice) => choice.field)
  choices: Choice[];

  @ManyToOne(() => FormSection, (formSection) => formSection.fields)
  formSection: FormSection;

  @OneToMany(() => FieldDependency, (dependency) => dependency.question)
  dependencies: FieldDependency[];

  @OneToMany(
    () => FieldDependency,
    (dependency) => dependency.dependentQuestion,
  )
  dependentQuestions: FieldDependency[];
}
