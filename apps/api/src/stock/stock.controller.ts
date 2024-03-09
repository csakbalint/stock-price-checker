import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
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

  @Put(':symbol')
  startPolling(@Param('symbol') symbol: string) {
    return this.stockService.startPolling(symbol);
  }

  // TODO: add a route to stop polling
}
