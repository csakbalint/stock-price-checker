import { Prisma } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { isEmpty, reduce } from 'lodash';

type SymbolWithQuotes = Prisma.SymbolGetPayload<{
  include: { quotes: true };
}>;

export class SymbolStockResponse implements SymbolWithQuotes {
  @Exclude({ toPlainOnly: true })
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  @Transform(({ obj }) => {
    if (isEmpty((obj as SymbolWithQuotes)?.quotes)) {
      return null;
    }
    return reduce(
      (obj as SymbolWithQuotes)?.quotes,
      (acc, quote) => (acc ?? 0) + quote.price,
      0,
    );
  })
  average!: number | null;

  @Expose()
  @Transform(({ obj }) => (obj as SymbolWithQuotes)?.quotes[0]?.price ?? null)
  current!: number | null;

  @Expose()
  @Transform(({ obj }) => {
    return (obj as SymbolWithQuotes)?.quotes[0]?.polledAt ?? null;
  })
  lastUpdatedAt!: string | null;

  @Exclude({ toPlainOnly: true })
  quotes!: SymbolWithQuotes['quotes'];

  constructor(partial: SymbolWithQuotes) {
    Object.assign(this, partial);
  }
}
