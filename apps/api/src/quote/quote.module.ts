import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { SYMBOL_QUOTE_UPDATE_QUEUE } from '@app/common';
import { DatabaseModule } from '@app/database';

import { UpdateQuoteConsumer } from './update-quote.consumer';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: SYMBOL_QUOTE_UPDATE_QUEUE }),
  ],
  providers: [UpdateQuoteConsumer],
})
export class QuoteModule {}
