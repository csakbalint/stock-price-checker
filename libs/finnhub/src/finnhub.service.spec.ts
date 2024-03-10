import { Test, TestingModule } from '@nestjs/testing';
import FinnhubAPI from '@stoqey/finnhub';

import { FinnhubService } from './finnhub.service';

describe('FinnhubService', () => {
  let service: FinnhubService;
  const mockApi = {
    symbolLookup: jest.fn(),
    getQuote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinnhubService, { provide: FinnhubAPI, useValue: mockApi }],
    }).compile();

    service = module.get<FinnhubService>(FinnhubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call api.symbolLookup', () => {
    const query = 'AAPL';
    service.getSymbols(query);
    expect(mockApi.symbolLookup).toHaveBeenCalledWith(query);
  });

  it('should call api.getQuote', () => {
    const symbol = 'AAPL';
    service.getQuote(symbol);
    expect(mockApi.getQuote).toHaveBeenCalledWith(symbol);
  });
});
