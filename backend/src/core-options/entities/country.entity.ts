import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ unique: true })
  name: string;
}
