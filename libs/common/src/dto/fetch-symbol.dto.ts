import { Expose } from 'class-transformer';

export class FetchSymbolDto {
  @Expose()
  symbol!: string;
}
