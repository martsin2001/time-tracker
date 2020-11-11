import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(start: Date, end: Date, format: string): string {
    const startDate: moment.Moment = moment(start);
    const endDate: moment.Moment = moment(end);
    return moment.utc(moment.duration(endDate.diff(startDate)).as('milliseconds')).format(format);
  }
}
