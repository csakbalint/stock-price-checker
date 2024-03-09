import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { find } from 'lodash';

import { FetchSymbolDto, SYMBOL_QUOTE_FETCH_QUEUE } from '@app/common';
import { DatabaseService } from '@app/database';
import { FinnhubService } from '@app/finnhub';

import { SymbolStockResponse } from './dto/symbol-stock-response.dto';

@Injectable()
export class StockService {
  constructor(
    private readonly db: DatabaseService,
    private readonly finnhubService: FinnhubService,
    @InjectQueue(SYMBOL_QUOTE_FETCH_QUEUE)
    private readonly fetchSymbolQueue: Queue<FetchSymbolDto>,
  ) {}

  async getStockBySymbol(symbolName: string) {
    const response = await this.db.symbol.findUnique({
      where: { name: symbolName },
      include: {
        quotes: {
          orderBy: { polledAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!response) {
      throw new NotFoundException(`Symbol "${symbolName}" not found.`);
    }
    return new SymbolStockResponse(response);
  }

  async startPolling(symbolName: string) {
    let symbol = await this.db.symbol.findUnique({
      where: { name: symbolName },
    });
    if (!symbol) {
      const results = await this.finnhubService.getSymbols(symbolName);
      const found = find(results?.result, { symbol: symbolName });

      if (!found) {
        throw new NotFoundException(`Symbol "${symbolName}" not found.`);
      }

      symbol = await this.db.symbol.create({
        data: { name: symbolName },
      });
    }
    // TODO: save the job name to the database so we can stop it later
    await this.fetchSymbolQueue.add(
      { symbol: symbolName },
      { repeat: { every: 10000 } },
    );

    return new SymbolStockResponse(symbol);
  }
}
