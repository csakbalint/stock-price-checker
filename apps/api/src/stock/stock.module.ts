import { Module } from '@nestjs/common';

import { CommonModule } from '@app/common';

import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [CommonModule],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
