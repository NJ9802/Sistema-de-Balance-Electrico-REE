import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnergyController } from 'modules/energy/energy.controller';
import { EnergyService } from 'modules/energy/energy.service';
import { EnergyCategory, EnergyRecord } from 'modules/energy/entities';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([EnergyCategory, EnergyRecord]),
  ],
  controllers: [EnergyController],
  providers: [EnergyService],
})
export class EnergyModule {}
