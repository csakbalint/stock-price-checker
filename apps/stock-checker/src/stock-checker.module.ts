import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { ConfigurationModule, ConfigurationService } from '@app/common';

import { SymbolCheckerModule } from './symbol-checker';

@Module({
  imports: [
    ConfigurationModule,
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
    SymbolCheckerModule,
  ],
})
export class StockCheckerModule {}
