import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import FinnhubAPI from '@stoqey/finnhub';

import { FinnhubService } from './finnhub.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: FinnhubAPI,
      useFactory: async (config: ConfigService) =>
        new FinnhubAPI(config.get('FINNHUB_API_KEY')),
      inject: [ConfigService],
    },
    FinnhubService,
  ],
  exports: [FinnhubService],
})
export class FinnhubModule {}
