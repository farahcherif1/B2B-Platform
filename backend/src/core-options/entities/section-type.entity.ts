import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SectionType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

} 