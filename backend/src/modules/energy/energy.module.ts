import { Module } from '@nestjs/common';
import { EnergyController } from './energy.controller';
import { EnergyService } from './energy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnergyCategory } from './entities/energy-category.entity';
import { EnergyRecord } from './entities/energy-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnergyCategory, EnergyRecord])],
  controllers: [EnergyController],
  providers: [EnergyService],
})
export class EnergyModule {}
