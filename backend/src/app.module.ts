import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TYPE_ORM_CONFIG } from './config/type-orm.config';
import { EnergyModule } from './modules/energy/energy.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
