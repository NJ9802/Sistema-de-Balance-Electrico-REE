import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPE_ORM_CONFIG } from 'config/type-orm.config';
import { EnergyModule } from 'modules/energy/energy.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TYPE_ORM_CONFIG,
    }),
    EnergyModule,
  ],
})
export class AppModule {}
