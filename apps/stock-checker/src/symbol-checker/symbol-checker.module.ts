import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import {
  SYMBOL_QUOTE_FETCH_QUEUE,
  SYMBOL_QUOTE_UPDATE_QUEUE,
} from '@app/common';
import { FinnhubModule } from '@app/finnhub';

import { SymbolCheckerConsumer } from './symbol-checker.consumer';

@Module({
  imports: [
    FinnhubModule,
    BullModule.registerQueue(
      { name: SYMBOL_QUOTE_FETCH_QUEUE },
      { name: SYMBOL_QUOTE_UPDATE_QUEUE },
    ),
  ],
  providers: [SymbolCheckerConsumer],
})
export class SymbolCheckerModule {}
