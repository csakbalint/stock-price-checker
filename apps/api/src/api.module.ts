import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { StockModule } from './stock/stock.module';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { QuoteModule } from './quote';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    StockModule,
    QuoteModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
