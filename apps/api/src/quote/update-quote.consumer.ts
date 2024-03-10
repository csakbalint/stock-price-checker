import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { SYMBOL_QUOTE_UPDATE_QUEUE } from '@app/common';
import { UpdateQuoteDto } from '@app/common/dto/update-quote.dto';
import { DatabaseService } from '@app/database';

@Processor({ name: SYMBOL_QUOTE_UPDATE_QUEUE })
export class UpdateQuoteConsumer {
  constructor(
    private readonly db: DatabaseService,
    @InjectPinoLogger(UpdateQuoteConsumer.name)
    private readonly logger: PinoLogger,
  ) {}

  @Process()
  async transcode(job: Job<UpdateQuoteDto>) {
    const { symbol: symbolName, ...quote } = job.data;
    try {
      this.logger.info(
        `Job [UpdateQuote-${symbolName}] started: ${JSON.stringify(job.data)}`,
      );
      let symbol = await this.db.symbol.findFirst({
        where: { name: symbolName },
      });
      if (!symbol) {
        // this is definitely not intended, so we log a warning
        this.logger.warn(
          `Job [UpdateQuote-${symbolName}] symbol not found in database, creating...`,
        );
        // we create the symbol if it doesn't exist but we don't force it
        // if a concurrent job creates the symbol, we'll just use that one
        symbol = await this.db.symbol.upsert({
          where: { name: symbolName },
          update: {},
          create: { name: symbolName },
        });
        this.logger.info(
          `Job [UpdateQuote-${symbolName}] symbol created ${JSON.stringify(symbol)}`,
        );
      }

      await this.db.quote.create({
        data: {
          symbolId: symbol.id,
          ...quote,
        },
      });
      this.logger.info(
        `Job [UpdateQuote-${symbolName}] finished ${JSON.stringify(quote)}`,
      );
    } catch (error) {
      this.logger.error(`Job [UpdateQuote-${symbolName}] error ${error}`);
      // re-throw the error to retry the job later
      throw error;
    }
  }
}
