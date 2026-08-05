import { Field } from 'src/application-management/entities/field.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FieldDependency } from 'src/application-management/entities/field-dependency.entity';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Field, (field) => field.choices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  field: Field;

  @OneToMany(() => FieldDependency, (dependency) => dependency.choice)
  dependencies: FieldDependency[]; // Dependencies triggered by this choice
}
