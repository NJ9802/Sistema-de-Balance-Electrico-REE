import { Controller, Get } from '@nestjs/common';
import { EnergyService } from 'modules/energy/energy.service';

@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Get('')
  getEnergyData() {
    return this.energyService.findAllRecords();
  }
}
