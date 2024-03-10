import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';

import { SYMBOL_QUOTE_UPDATE_QUEUE } from '@app/common';
import { FinnhubService } from '@app/finnhub';

import { SymbolCheckerConsumer } from './symbol-checker.consumer';

describe('SymbolCheckerConsumer', () => {
  let consumer: SymbolCheckerConsumer;
  const finnhubService = {
    getQuote: jest.fn(),
  };
  const updateQuoteQueue = {
    add: jest.fn(),
  };
  const logger = {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SymbolCheckerConsumer,
        {
          provide: FinnhubService,
          useValue: finnhubService,
        },
        {
          provide: getQueueToken(SYMBOL_QUOTE_UPDATE_QUEUE),
          useValue: updateQuoteQueue,
        },
        {
          provide: getLoggerToken(SymbolCheckerConsumer.name),
          useValue: logger,
        },
      ],
    }).compile();

    consumer = module.get(SymbolCheckerConsumer);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  describe('transcode', () => {
    describe('when the job is successful', () => {
      beforeEach(async () => {
        finnhubService.getQuote.mockResolvedValue({ close: 100 });
        // let's assume that the job is { data: { symbol: 'AAPL' } }
        // we don't need any other data for this test
        await consumer.transcode({ data: { symbol: 'AAPL' } } as any);
      });

      it('should call finnhubService.getQuote', () => {
        expect(finnhubService.getQuote).toHaveBeenCalledWith('AAPL');
      });

      it('should call updateQuoteQueue.add', () => {
        expect(updateQuoteQueue.add).toHaveBeenCalledWith({
          symbol: 'AAPL',
          price: 100,
        });
      });

      it('should call logger.info', () => {
        expect(logger.info).toHaveBeenCalledWith(
          'Job [SymbolChecker-AAPL] started',
        );
      });
    });

    describe('when the job fails', () => {
      beforeEach(async () => {
        finnhubService.getQuote.mockRejectedValue(new Error('test error'));
        expect(() =>
          consumer.transcode({ data: { symbol: 'AAPL' } } as any),
        ).not.toThrow(Error);
      });

      it('should call finnhubService.getQuote', async () => {
        expect(finnhubService.getQuote).toHaveBeenCalledWith('AAPL');
      });

      it('should not call updateQuoteQueue.add', async () => {
        expect(updateQuoteQueue.add).not.toHaveBeenCalled();
      });

      it('should call logger.error', async () => {
        expect(logger.error).toHaveBeenCalledWith(
          'Job [SymbolChecker-AAPL] error Error: test error',
        );
      });
    });
  });
});
