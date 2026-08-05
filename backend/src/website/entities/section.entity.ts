import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { WebsiteTab } from './website-tab.entity';
import { SectionType } from '../../core-options/entities/section-type.entity';
import { ImageUrl } from './image-url.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;


  @ManyToOne(() => WebsiteTab, (websiteTab) => websiteTab.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'website_tab_id' })
  websiteTab: WebsiteTab;

  @ManyToOne(() => SectionType, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'section_type_id' })
  type: SectionType;

  @OneToMany(() => ImageUrl, (imageUrl) => imageUrl.section, {
    cascade: true,
  })
  images: ImageUrl[];
}
