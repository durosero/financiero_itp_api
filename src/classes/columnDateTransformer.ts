import * as moment from 'moment';
export class ColumnDateTransformer {
  from(value: string): Date {
    return !value ? null : moment(value, 'YYYY-MM-DD').toDate();
  }
  to(value: string): string {
    return value;
  }
}
