import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '@app/database';

import { SymbolStockResponse } from './dto/symbol-stock-response.dto';

@Injectable()
export class StockService {
  constructor(private readonly db: DatabaseService) {}

  async getStockBySymbol(symbol: string) {
    const response = await this.db.symbol.findUnique({
      where: { name: symbol },
      include: {
        quotes: {
          orderBy: { polledAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!response) {
      throw new NotFoundException(`Symbol "${symbol}" not found.`);
    }
    return new SymbolStockResponse(response);
  }
}
