import { Module } from '@nestjs/common';

import { StockModule } from './stock/stock.module';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [StockModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
