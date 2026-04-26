import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EnergyService } from 'modules/energy/energy.service';
import { GetEnergyFilterDto } from './dtos/get-energy-filter.dto';

@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('balance')
  getBalance(@Query() getEnergyFilterDto: GetEnergyFilterDto) {
    return this.energyService.getFilteredBalance(
      getEnergyFilterDto.startDate,
      getEnergyFilterDto.endDate,
    );
  }

  @Post('ingest-data')
  ingestData(@Body() getEnergyFilterDto: GetEnergyFilterDto) {
    return this.energyService.ingestData(
      getEnergyFilterDto.startDate,
      getEnergyFilterDto.endDate,
    );
  }
}
