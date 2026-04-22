import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { EnergyCategory } from './energy-category.entity';

@Entity('energy_records')
@Index(['datetime', 'category'])
export class EnergyRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('float')
  value!: number;

  @Column('float', { nullable: true })
  percentage!: number;

  @Column('timestamptz')
  datetime!: Date;

  @ManyToOne(() => EnergyCategory, (category) => category.records)
  category!: EnergyCategory;
}
