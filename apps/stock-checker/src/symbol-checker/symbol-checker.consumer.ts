import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import {
  FetchSymbolDto,
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
    @InjectPinoLogger(SymbolCheckerConsumer.name)
    private readonly logger: PinoLogger,
  ) {}

  @Process()
  async transcode(job: Job<FetchSymbolDto>) {
    const { symbol: symbolName } = job.data;
    try {
      this.logger.info(`Job [SymbolChecker-${symbolName}] started`);
      const results = await this.finnhubService.getQuote(symbolName);
      this.logger.debug(
        `Job [SymbolChecker-${symbolName}] quote fetched ${JSON.stringify(results)}`,
      );
      // TODO: transfer date
      await this.updateQuoteQueue.add({
        symbol: symbolName,
        price: results.close,
      });
      this.logger.info(`Job [SymbolChecker-${symbolName}] finished`);
    } catch (error) {
      // we don't want to retry this job, because it's repeated every minute
      // so we only log the error
      this.logger.error(`Job [SymbolChecker-${symbolName}] error ${error}`);
    }
  }
}
