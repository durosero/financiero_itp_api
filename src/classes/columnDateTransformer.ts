export class ColumnDateTransformer {
  from(value: string): Date {
    return !value ? null : new Date(value);
  }
  to(value: string): string {
    return value;
  }
}
