import { getQueueToken } from '@nestjs/bull';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';

import { ConfigurationService, SYMBOL_QUOTE_FETCH_QUEUE } from '@app/common';
import { DatabaseService } from '@app/database';
import { FinnhubService } from '@app/finnhub';

import { StockService } from './stock.service';

describe('StockService', () => {
  let service: StockService;
  const mockDbService = {
    symbol: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };
  const mockFinnhubService = {
    getSymbols: jest.fn(),
  };
  const mockQueue = {
    add: jest.fn(),
  };
  const config = {
    get: jest.fn(),
  };
  const logger = {
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        { provide: ConfigurationService, useValue: config },
        { provide: DatabaseService, useValue: mockDbService },
        { provide: FinnhubService, useValue: mockFinnhubService },
        {
          provide: getQueueToken(SYMBOL_QUOTE_FETCH_QUEUE),
          useValue: mockQueue,
        },
        { provide: getLoggerToken(StockService.name), useValue: logger },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getStockBySymbol', () => {
    describe('when the symbol is found', () => {
      beforeEach(async () => {
        mockDbService.symbol.findUnique.mockResolvedValue({
          name: 'AAPL',
          quotes: [],
        });
        await service.getStockBySymbol('AAPL');
      });

      it('should call db.symbol.findUnique', () => {
        expect(mockDbService.symbol.findUnique).toHaveBeenCalledWith({
          where: { name: 'AAPL' },
          include: {
            quotes: {
              orderBy: { polledAt: 'desc' },
              take: 10,
            },
          },
        });
      });
    });
    describe('when the symbol is not found', () => {
      beforeEach(async () => {
        mockDbService.symbol.findUnique.mockResolvedValue(null);
      });

      it('should throw a NotFoundException', async () => {
        await expect(service.getStockBySymbol('AAPL')).rejects.toThrow(
          new NotFoundException('Symbol "AAPL" not found.'),
        );
      });
    });
  });

  describe('#startPolling', () => {
    describe('when the symbol is found', () => {
      beforeEach(async () => {
        mockDbService.symbol.findUnique.mockResolvedValue({ name: 'AAPL' });
        config.get.mockReturnValue(10000);
        await service.startPolling('AAPL');
      });

      it('should call db.symbol.findUnique', () => {
        expect(mockDbService.symbol.findUnique).toHaveBeenCalledWith({
          where: { name: 'AAPL' },
          include: {
            quotes: {
              orderBy: { polledAt: 'desc' },
              take: 10,
            },
          },
        });
      });

      it('should not call db.symbol.upsert', () => {
        expect(mockDbService.symbol.upsert).not.toHaveBeenCalled();
      });

      it('should call fetchSymbolQueue.add', () => {
        expect(mockQueue.add).toHaveBeenCalledWith(
          { symbol: 'AAPL' },
          { repeat: { every: 10000 } },
        );
      });
    });

    describe('when the symbol is not found', () => {
      beforeEach(async () => {
        mockDbService.symbol.findUnique.mockResolvedValue(null);
        mockFinnhubService.getSymbols.mockResolvedValue({
          result: [{ symbol: 'AAPL' }],
        });
        await service.startPolling('AAPL');
      });

      it('should call db.symbol.findUnique', () => {
        expect(mockDbService.symbol.findUnique).toHaveBeenCalledWith({
          where: { name: 'AAPL' },
          include: {
            quotes: {
              orderBy: { polledAt: 'desc' },
              take: 10,
            },
          },
        });
      });

      it('should call finnhubService.getSymbols', () => {
        expect(mockFinnhubService.getSymbols).toHaveBeenCalledWith('AAPL');
      });

      it('should call db.symbol.upsert', () => {
        expect(mockDbService.symbol.upsert).toHaveBeenCalledWith({
          where: { name: 'AAPL' },
          update: {},
          create: { name: 'AAPL' },
          include: {
            quotes: {
              orderBy: {
                polledAt: 'desc',
              },
              take: 10,
            },
          },
        });
      });
    });
  });
});
