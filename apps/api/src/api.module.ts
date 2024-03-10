import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ConfigurationModule, ConfigurationService } from '@app/common';

import { StockModule } from './stock/stock.module';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { QuoteModule } from './quote';

@Module({
  imports: [
    ConfigurationModule,
    LoggerModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (config: ConfigurationService) => ({
        pinoHttp: {
          name: 'Api',
          level: config.get('NODE_ENV') !== 'production' ? 'debug' : 'info',
          transport:
            config.get('NODE_ENV') !== 'production'
              ? { target: 'pino-pretty' }
              : undefined,
        },
      }),
      inject: [ConfigurationService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (config: ConfigurationService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigurationService],
    }),
    StockModule,
    QuoteModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
