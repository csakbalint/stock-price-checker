import { NestFactory } from '@nestjs/core';

import { StockCheckerModule } from './stock-checker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(StockCheckerModule);
}
bootstrap();
