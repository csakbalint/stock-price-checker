import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { find } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import {
  ConfigurationService,
  FetchSymbolDto,
  SYMBOL_QUOTE_FETCH_QUEUE,
  TooManyRequestsException,
} from '@app/common';
import { DatabaseService } from '@app/database';
import { FinnhubService } from '@app/finnhub';

import { SymbolStockResponse } from './dto/symbol-stock-response.dto';

@Injectable()
export class StockService {
  constructor(
    private readonly config: ConfigurationService,
    private readonly db: DatabaseService,
    private readonly finnhubService: FinnhubService,
    @InjectQueue(SYMBOL_QUOTE_FETCH_QUEUE)
    private readonly fetchSymbolQueue: Queue<FetchSymbolDto>,
    @InjectPinoLogger(StockService.name)
    private readonly logger: PinoLogger,
  ) {}

  async getStockBySymbol(symbolName: string) {
    const symbol = await this.fetchSymbol(symbolName);
    if (!symbol) {
      throw new NotFoundException(`Symbol "${symbolName}" not found.`);
    }
    return new SymbolStockResponse(symbol);
  }

  async startPolling(symbolName: string) {
    let symbol = await this.fetchSymbol(symbolName);
    if (!symbol) {
      // TODO: stock-checker is responsible for communicating with the Finnhub API
      // so we should probably move this logic to the stock-checker service and
      // call it via RPC
      // TODO: also it would be good to cache the results of this call
      const found = await this.querySymbolExternal(symbolName);

      if (!found) {
        throw new NotFoundException(`Symbol "${symbolName}" not found.`);
      }
      // we create the symbol if it doesn't exist but we don't force it
      // if a concurrent job creates the symbol, we'll just use that one
      // TODO: save the job name to the database so we can stop it later
      symbol = await this.db.symbol.upsert({
        where: { name: symbolName },
        update: {},
        create: { name: symbolName },
        include: {
          quotes: {
            orderBy: { polledAt: 'desc' },
            take: 10,
          },
        },
      });
    }
    await this.fetchSymbolQueue.add(
      { symbol: symbolName },
      { repeat: { every: this.config.get('REPEAT_STOCK_POLLING_MS', 60000) } },
    );

    return new SymbolStockResponse(symbol);
  }

  private async querySymbolExternal(symbolName: string) {
    try {
      const results = await this.finnhubService.getSymbols(symbolName);
      return find(results?.result, { symbol: symbolName });
    } catch (error) {
      this.logger.warn(`Failed to fetch symbol from Finnhub API: ${error}`);
      // let's treat the request the same way as the Finnhub API
      throw new TooManyRequestsException();
    }
  }

  private async fetchSymbol(symbolName: string) {
    return this.db.symbol.findUnique({
      where: { name: symbolName },
      include: {
        quotes: {
          orderBy: { polledAt: 'desc' },
          take: 10,
        },
      },
    });
  }
}
