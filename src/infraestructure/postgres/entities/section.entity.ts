import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sections' })
export class SectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false })
  image: string;
}
