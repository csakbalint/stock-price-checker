import { Test, TestingModule } from '@nestjs/testing';

import { StockController } from './stock.controller';
import { StockService } from './stock.service';

describe('StockController', () => {
  let controller: StockController;
  const mockService = {
    getStockBySymbol: jest.fn(),
    startPolling: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: StockService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StockController>(StockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call stockService.getStockBySymbol', () => {
    const symbol = 'AAPL';
    controller.getStockBySymbol(symbol);
    expect(mockService.getStockBySymbol).toHaveBeenCalledWith(symbol);
  });

  it('should call stockService.startPolling', () => {
    const symbol = 'AAPL';
    controller.startPolling(symbol);
    expect(mockService.startPolling).toHaveBeenCalledWith(symbol);
  });
});
