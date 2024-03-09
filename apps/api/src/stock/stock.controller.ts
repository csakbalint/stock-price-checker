import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { StockService } from './stock.service';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':symbol')
  getStockBySymbol(@Param('symbol') symbol: string) {
    return this.stockService.getStockBySymbol(symbol);
  }
}
