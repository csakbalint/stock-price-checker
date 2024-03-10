import { Prisma } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { map, sum } from 'lodash';

type SymbolWithQuotes = Prisma.SymbolGetPayload<{
  include: { quotes: true };
}>;

export class SymbolStockResponse implements SymbolWithQuotes {
  @Exclude({ toPlainOnly: true })
  id!: string;

  @Expose()
  @Transform(({ value }) => value ?? null)
  name!: string;

  @Expose()
  @Transform(({ obj }) => {
    const values = map((obj as SymbolWithQuotes)?.quotes, 'price');
    return values.length ? sum(values) / values.length : null;
  })
  average!: number | null;

  @Expose()
  @Transform(({ obj }) => (obj as SymbolWithQuotes)?.quotes?.[0]?.price ?? null)
  current!: number | null;

  @Expose()
  @Transform(({ obj }) => {
    return (obj as SymbolWithQuotes)?.quotes?.[0]?.polledAt ?? null;
  })
  lastUpdatedAt!: string | null;

  @Exclude({ toPlainOnly: true })
  quotes!: SymbolWithQuotes['quotes'];

  constructor(partial: Partial<SymbolWithQuotes>) {
    Object.assign(this, partial);
  }
}
