import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { EnergyCategory, EnergyRecord } from 'modules/energy/entities';
import { REEResponse } from 'modules/energy/interfaces';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class EnergyService {
  private readonly logger = new Logger(EnergyService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(EnergyCategory)
    private categoryRepo: Repository<EnergyCategory>,
    @InjectRepository(EnergyRecord)
    private recordRepo: Repository<EnergyRecord>,
  ) {}

  @Cron('12 19 * * *')
  async handleCron() {
    this.logger.log('Iniciando ingesta de datos REE...');

    const today = new Date().toISOString().split('T')[0];
    console.log({ today });
    await this.fetchAndStore(today, today);
  }

  async fetchAndStore(startDate: string, endDate: string) {
    const url = `https://apidatos.ree.es/es/datos/balance/balance-electrico?start_date=${startDate}T00:00&end_date=${endDate}T23:59&time_trunc=day`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<REEResponse>(url),
      );

      for (const group of data.included) {
        const groupId = group.type;

        for (const item of group.attributes.content) {
          const category = await this.categoryRepo.save({
            id: item.id,
            title: item.attributes.title,
            groupId: groupId,
            color: item.attributes.color,
          });

          for (const val of item.attributes.values) {
            const existingRecord = await this.recordRepo.findOne({
              where: {
                datetime: new Date(val.datetime),
                category: { id: category.id },
              },
            });

            if (!existingRecord) {
              await this.recordRepo.save({
                value: val.value,
                percentage: val.percentage,
                datetime: new Date(val.datetime),
                category: category,
              });
            }
          }
        }
      }
      this.logger.log('Ingesta completada con éxito');
    } catch (error) {
      this.logger.error(
        'Error en la ingesta de REE',
        error instanceof AxiosError ? error.toJSON() : error,
      );
    }
  }

  findAllRecords() {
    return this.recordRepo.find({ relations: { category: true } });
  }
}
