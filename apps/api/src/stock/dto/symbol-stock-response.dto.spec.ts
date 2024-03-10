import { instanceToPlain } from 'class-transformer';

import { SymbolStockResponse } from './symbol-stock-response.dto';

describe('SymbolStockResponse', () => {
  it('empty payload', () => {
    expect(instanceToPlain(new SymbolStockResponse({}), {})).toEqual({
      average: null,
      current: null,
      lastUpdatedAt: null,
      name: null,
    });
  });

  it('empty quotes', () => {
    expect(
      instanceToPlain(
        new SymbolStockResponse({
          name: 'AAPL',
          quotes: [],
        }),
        {},
      ),
    ).toEqual({
      average: null,
      current: null,
      lastUpdatedAt: null,
      name: 'AAPL',
    });
  });

  it('1 quote', () => {
    expect(
      instanceToPlain(
        new SymbolStockResponse({
          name: 'AAPL',
          quotes: [
            {
              id: 'test1',
              price: 100,
              polledAt: new Date('2021-01-01T00:00:00Z'),
              symbolId: 'testSymbolId',
            },
          ],
        }),
        {},
      ),
    ).toEqual({
      average: 100,
      current: 100,
      lastUpdatedAt: new Date('2021-01-01T00:00:00Z'),
      name: 'AAPL',
    });
  });

  it('multiple quotes', () => {
    expect(
      instanceToPlain(
        new SymbolStockResponse({
          name: 'AAPL',
          quotes: [
            {
              id: 'test1',
              price: 100,
              polledAt: new Date('2021-01-03T00:00:00Z'),
              symbolId: 'testSymbolId',
            },
            {
              id: 'test2',
              price: 200,
              polledAt: new Date('2021-01-02T00:00:00Z'),
              symbolId: 'testSymbolId',
            },
            {
              id: 'test3',
              price: 300,
              polledAt: new Date('2021-01-01T00:00:00Z'),
              symbolId: 'testSymbolId',
            },
          ],
        }),
        {},
      ),
    ).toEqual({
      average: 200,
      current: 100,
      lastUpdatedAt: new Date('2021-01-03T00:00:00Z'),
      name: 'AAPL',
    });
  });
});
