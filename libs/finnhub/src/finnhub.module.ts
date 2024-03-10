import { Module } from '@nestjs/common';
import FinnhubAPI from '@stoqey/finnhub';

import { ConfigurationModule, ConfigurationService } from '@app/common';

import { FinnhubService } from './finnhub.service';

@Module({
  imports: [ConfigurationModule],
  providers: [
    {
      provide: FinnhubAPI,
      // FIXME: replace this library because it consumes error, which is not a good practice
      useFactory: async (config: ConfigurationService) =>
        new FinnhubAPI(config.get('FINNHUB_API_KEY')),
      inject: [ConfigurationService],
    },
    FinnhubService,
  ],
  exports: [FinnhubService],
})
export class FinnhubModule {}
