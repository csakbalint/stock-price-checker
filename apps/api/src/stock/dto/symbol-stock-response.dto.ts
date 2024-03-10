import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { map, sum } from 'lodash';

type SymbolWithQuotes = Prisma.SymbolGetPayload<{
  include: { quotes: true };
}>;

export class SymbolStockResponse implements SymbolWithQuotes {
  @Exclude({ toPlainOnly: true })
  id!: string;

  @ApiProperty({ type: String, example: 'AAPL' })
  @Expose()
  @Transform(({ value }) => value ?? null)
  name!: string;

  @ApiProperty({ type: Number, nullable: true, example: 100 })
  @Expose()
  @Transform(({ obj }) => {
    const values = map((obj as SymbolWithQuotes)?.quotes, 'price');
    return values.length ? sum(values) / values.length : null;
  })
  average!: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 100 })
  @Expose()
  @Transform(({ obj }) => (obj as SymbolWithQuotes)?.quotes?.[0]?.price ?? null)
  current!: number | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '2021-08-01T00:00:00.000Z',
  })
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
