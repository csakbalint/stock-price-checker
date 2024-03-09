import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { SYMBOL_QUOTE_UPDATE_QUEUE } from '@app/common';
import { UpdateQuoteDto } from '@app/common/dto/update-quote.dto';
import { DatabaseService } from '@app/database';

@Processor({ name: SYMBOL_QUOTE_UPDATE_QUEUE })
export class UpdateQuoteConsumer {
  constructor(private readonly db: DatabaseService) {}

  @Process()
  async transcode(job: Job<UpdateQuoteDto>) {
    try {
      const { symbol: symbolName, ...quote } = job.data;
      let symbol = await this.db.symbol.findUnique({
        where: { name: symbolName },
      });

      if (!symbol) {
        symbol = await this.db.symbol.create({ data: { name: symbolName } });
      }

      await this.db.quote.create({
        data: {
          symbolId: symbol.id,
          ...quote,
        },
      });
    } catch (error) {
      // FIXME: handle error
      // TODO: add logging
      console.error(error);
    }
  }
}
