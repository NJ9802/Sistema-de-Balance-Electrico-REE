import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnergyCategory } from 'src/modules/energy/entities/energy-category.entity';
import { EnergyRecord } from 'src/modules/energy/entities/energy-record.entity';

export const TYPE_ORM_CONFIG: (
  configService: ConfigService,
) => TypeOrmModuleOptions = (configService: ConfigService) => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', 'root'),
  database: configService.get<string>('DB_NAME', 'test'),
  entities: [EnergyCategory, EnergyRecord],
  synchronize: configService.get<string>('IS_DEV', 'false') === 'true',
});
