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
import { CATEGORY_GROUPS } from './constants/category-groups';

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
    this.logger.log('Iniciando ingesta automática de datos REE...');

    const todayStr = new Date().toISOString().split('T')[0];
    let startDateStr = todayStr;
    const endDateStr = todayStr;

    try {
      const lastRecord = await this.recordRepo
        .find({
          order: { datetime: 'DESC' },
          take: 1,
        })
        .then((records) => records[0]);

      if (lastRecord) {
        const nextDayToFetch = new Date(lastRecord.datetime);
        nextDayToFetch.setDate(nextDayToFetch.getDate() + 1);
        const nextDayStr = nextDayToFetch.toISOString().split('T')[0];

        if (nextDayStr < endDateStr) {
          this.logger.warn(
            `Detectados días faltantes en DB. Recuperando datos desde ${nextDayStr} hasta ${endDateStr}...`,
          );
          startDateStr = nextDayStr;
        }
      }
    } catch (error) {
      this.logger.error('Error al verificar el último registro en DB', error);
    }

    const MAX_RETRIES = 3;
    let attempt = 0;
    let success = false;

    while (attempt < MAX_RETRIES && !success) {
      try {
        attempt++;
        this.logger.log(
          `Intento ${attempt}/${MAX_RETRIES} para el periodo ${startDateStr} al ${endDateStr}...`,
        );

        await this.fetchAndStore(
          `${startDateStr}T00:00`,
          `${endDateStr}T23:59`,
        );

        success = true;
        this.logger.log('Ingesta automática completada con éxito.');
      } catch (error) {
        this.logger.error(
          `Fallo en el intento ${attempt}`,
          error instanceof Error ? error.message : error,
        );

        if (attempt < MAX_RETRIES) {
          this.logger.log('Esperando 10 segundos antes de reintentar...');

          await new Promise((resolve) => setTimeout(resolve, 5000));
        } else {
          this.logger.error(
            `Máximo de reintentos alcanzado. El sistema intentará recuperar estos datos mañana.`,
          );
        }
      }
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

  async getFilteredBalance(startDate: string, endDate: string) {
    try {
      const categories = await this.categoryRepo.find();
      const records = await this.recordRepo.find({
        where: { datetime: Between(new Date(startDate), new Date(endDate)) },
        order: { datetime: 'ASC' },
        relations: { category: true },
      });

      const filteredCategories = categories.filter(
        (category) => !CATEGORY_GROUPS.includes(category.id),
      );
      const filteredRecords = records.filter(
        (record) => !CATEGORY_GROUPS.includes(record.category.id),
      );

      const groups = records.filter((record) =>
        CATEGORY_GROUPS.includes(record.category.id),
      );

      return {
        data: {
          categories: filteredCategories,
          groups,
          records: filteredRecords,
        },
        count: filteredRecords.length,
      };
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
