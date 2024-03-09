import { Injectable } from '@nestjs/common';
import FinnhubAPI from '@stoqey/finnhub';

@Injectable()
export class FinnhubService {
  constructor(private readonly api: FinnhubAPI) {}

  getSymbols(query?: string) {
    return this.api.symbolLookup(query);
  }

  getQuotes(symbol: string) {
    return this.api.getQuote(symbol);
  }
}
