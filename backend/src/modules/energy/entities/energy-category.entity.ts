import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { EnergyRecord } from './energy-record.entity';

@Entity('energy_categories')
export class EnergyCategory {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  groupId!: string;

  @Column({ nullable: true })
  color!: string;

  @OneToMany(() => EnergyRecord, (record) => record.category)
  records!: EnergyRecord[];
}
