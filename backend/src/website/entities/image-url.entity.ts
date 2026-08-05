import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from './section.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ImageUrl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(() => Section, (section) => section.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  @Exclude() // This prevents circular reference during serialization
  section: Section;
}
