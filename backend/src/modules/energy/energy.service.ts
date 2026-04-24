import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { EnergyCategory, EnergyRecord } from 'modules/energy/entities';
import { REEResponse } from 'modules/energy/interfaces';
import { firstValueFrom } from 'rxjs';
import { Between, Repository } from 'typeorm';

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Iniciando ingesta de datos REE...');

    const today = new Date().toISOString().split('T')[0];
    try {
      await this.fetchAndStore(`${today}T00:00`, `${today}T23:59`);
    } catch (error) {
      this.logger.error('Fallo en la ejecución del Cron Job de ingesta', error);
    }
  }

  async fetchAndStore(startDate: string, endDate: string) {
    const url = `https://apidatos.ree.es/es/datos/balance/balance-electrico?start_date=${startDate}&end_date=${endDate}&time_trunc=day`;
    let responseData: REEResponse;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<REEResponse>(url),
      );
      responseData = data;
    } catch (error) {
      this.logger.error(
        'Error al contactar con la API de REE',
        error instanceof AxiosError ? error.message : error,
      );

      throw new BadGatewayException(
        'El servicio externo de REE no está disponible en este momento. Inténtelo más tarde.',
      );
    }

    try {
      for (const group of responseData.included) {
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
      this.logger.log(
        `Ingesta completada con éxito para el periodo ${startDate} a ${endDate}`,
      );
      return {
        message: 'Ingesta de datos procesada correctamente',
        data: responseData,
      };
    } catch (error) {
      this.logger.error('Error al guardar datos en la Base de Datos', error);

      throw new InternalServerErrorException(
        'Ocurrió un error al procesar y almacenar los datos de energía.',
      );
    }
  }

  findAllRecords() {
    return this.recordRepo.find({
      relations: { category: true },
      order: { datetime: 'ASC' },
    });
  }

  getFilteredBalance(startDate: string, endDate: string) {
    try {
      return this.recordRepo.find({
        where: { datetime: Between(new Date(startDate), new Date(endDate)) },
        order: { datetime: 'ASC' },
        relations: { category: true },
      });
    } catch (error) {
      this.logger.error('Error al consultar el balance filtrado', error);
      throw new InternalServerErrorException(
        'Error al consultar el balance filtrado',
      );
    }
  }

  async ingestData(startDate: string, endDate: string) {
    return this.fetchAndStore(startDate, endDate);
  }
}
