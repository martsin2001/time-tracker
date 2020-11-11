import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

@Pipe({ name: 'timer' })
export class TimerPipe implements PipeTransform {
  timeParams: string[] = ['Sec', 'Min', 'H'];

  transform(seconds: number): string {
    return moment
      .duration(seconds, 'seconds')
      .format('s:m:h')
      .split(':')
      .map((time: string, index: number) => `${time} ${this.timeParams[index]}`)
      .reverse()
      .join(' ');
  }
}
