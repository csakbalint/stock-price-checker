import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

import {
  SYMBOL_QUOTE_FETCH_QUEUE,
  SYMBOL_QUOTE_UPDATE_QUEUE,
} from '@app/common';
import { UpdateQuoteDto } from '@app/common/dto/update-quote.dto';
import { FinnhubService } from '@app/finnhub';

@Processor({ name: SYMBOL_QUOTE_FETCH_QUEUE })
export class SymbolCheckerConsumer {
  constructor(
    private readonly finnhubService: FinnhubService,
    @InjectQueue(SYMBOL_QUOTE_UPDATE_QUEUE)
    private readonly updateQuoteQueue: Queue<UpdateQuoteDto>,
  ) {}

  @Process()
  async transcode(job: Job<{ name: string }>) {
    const { name } = job.data;
    try {
      const results = await this.finnhubService.getQuote(name);
      // TODO: transfer date
      await this.updateQuoteQueue.add({
        symbol: name,
        price: results.close,
      });
    } catch (error) {
      // FIXME: handle error
      // TODO: add logging
      console.error(error);
    }
  }
}
