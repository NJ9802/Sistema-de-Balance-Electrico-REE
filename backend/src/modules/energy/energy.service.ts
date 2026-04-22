import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnergyCategory } from './entities/energy-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EnergyService {
  constructor(
    @InjectRepository(EnergyCategory)
    private readonly energyCategoryRepository: Repository<EnergyCategory>,
  ) {}

  findAll() {
    return this.energyCategoryRepository.find();
  }
}
