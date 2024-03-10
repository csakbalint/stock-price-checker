import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';

import { DatabaseService } from '@app/database';

import { UpdateQuoteConsumer } from './update-quote.consumer';

describe('UpdateQuoteConsumer', () => {
  let consumer: UpdateQuoteConsumer;
  const db = {
    symbol: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    quote: {
      create: jest.fn(),
    },
  };
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateQuoteConsumer,
        {
          provide: DatabaseService,
          useValue: db,
        },
        {
          provide: getLoggerToken(UpdateQuoteConsumer.name),
          useValue: logger,
        },
      ],
    }).compile();

    consumer = module.get(UpdateQuoteConsumer);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  describe('transcode', () => {
    describe('when symbol not found', () => {
      beforeEach(async () => {
        db.symbol.findFirst.mockResolvedValue(null);
        db.symbol.upsert.mockResolvedValue({ id: 1, name: 'AAPL' });
        // let's assume that the job is { data: { symbol: 'AAPL' } }
        // we don't need any other data for this test
        await consumer.transcode({
          data: { symbol: 'AAPL', price: 100 },
        } as any);
      });

      it('should call db.symbol.findFirst', async () => {
        expect(db.symbol.findFirst).toHaveBeenCalledWith({
          where: { name: 'AAPL' },
        });
      });

      it('should call logger.warn', async () => {
        expect(logger.warn).toHaveBeenCalledWith(
          'Job [UpdateQuote-AAPL] symbol not found in database, creating...',
        );
      });

      it('should call db.symbol.upsert', async () => {
        expect(db.symbol.upsert).toHaveBeenCalledWith({
          where: { name: 'AAPL' },
          update: {},
          create: { name: 'AAPL' },
        });
      });

      it('should call db.quote.create', async () => {
        expect(db.quote.create).toHaveBeenCalledWith({
          data: {
            symbolId: 1,
            price: 100,
          },
        });
      });
    });

    describe('when symbol found', () => {
      beforeEach(async () => {
        db.symbol.findFirst.mockResolvedValue({ id: 1, name: 'AAPL' });
        // let's assume that the job is { data: { symbol: 'AAPL' } }
        // we don't need any other data for this test
        await consumer.transcode({
          data: { symbol: 'AAPL', price: 100 },
        } as any);
      });

      it('should call db.symbol.findFirst', async () => {
        expect(db.symbol.findFirst).toHaveBeenCalledWith({
          where: { name: 'AAPL' },
        });
      });

      it('should not call db.symbol.upsert', async () => {
        expect(db.symbol.upsert).not.toHaveBeenCalled();
      });

      it('should call db.quote.create', async () => {
        expect(db.quote.create).toHaveBeenCalledWith({
          data: {
            symbolId: 1,
            price: 100,
          },
        });
      });
    });
  });
});
