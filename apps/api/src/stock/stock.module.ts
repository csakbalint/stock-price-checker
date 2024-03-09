import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { SYMBOL_QUOTE_FETCH_QUEUE } from '@app/common';
import { DatabaseModule } from '@app/database';
import { FinnhubModule } from '@app/finnhub';

import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [
    DatabaseModule,
    FinnhubModule,
    BullModule.registerQueue({ name: SYMBOL_QUOTE_FETCH_QUEUE }),
  ],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
