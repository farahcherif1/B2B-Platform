import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field } from 'src/application-management/entities/field.entity';
import { Choice } from 'src/core-options/entities/choice.entity';

@Entity()
export class FieldDependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Field, (field) => field.dependencies, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'question_id' })
  question: Field; // The main question

  @ManyToOne(() => Field, (field) => field.dependentQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dependent_question_id' })
  dependentQuestion: Field;

  @ManyToOne(() => Choice, (choice) => choice.dependencies)
  @JoinColumn({ name: 'choice_id' })
  choice: Choice;
}
