import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SymbolStockResponse } from './dto/symbol-stock-response.dto';

import { StockService } from './stock.service';

@ApiTags('stock')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiOkResponse({
    description: 'Stocks found.',
    type: SymbolStockResponse,
  })
  @ApiNotFoundResponse({ description: 'Symbol "{symbolName}" not found.' })
  @Get(':symbol')
  getStockBySymbol(@Param('symbol') symbol: string) {
    return this.stockService.getStockBySymbol(symbol);
  }

  @ApiOkResponse({
    description: 'Stocks found.',
    type: SymbolStockResponse,
  })
  @ApiNotFoundResponse({ description: 'Symbol "{symbolName}" not found.' })
  @Put(':symbol')
  startPolling(@Param('symbol') symbol: string) {
    return this.stockService.startPolling(symbol);
  }

  // TODO: add a route to stop polling
}
