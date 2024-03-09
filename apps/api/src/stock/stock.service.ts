import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@app/common';

import { SymbolStockResponse } from './dto/symbol-stock-response.dto';

@Injectable()
export class StockService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStockBySymbol(symbol: string) {
    const response = await this.prismaService.symbol.findUnique({
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
