import { Pipe, PipeTransform } from '@angular/core';
import { TimeTrackerEntry } from '../models/time-tracker-entry.models';
import 'moment-duration-format';
import * as moment from 'moment';
import * as _ from 'lodash';

@Pipe({ name: 'transformEntriesList' })
export class EntriesListPipe implements PipeTransform {
  transform(list: TimeTrackerEntry[]): Array<{ date: string; list: TimeTrackerEntry[] }> {
    const sortedList: TimeTrackerEntry[] = _.orderBy(list, (entry) => moment(entry.modifiedAt), ['desc']);
    const mappedLists: Map<string, TimeTrackerEntry[]> = new Map();
    sortedList.forEach((entry: TimeTrackerEntry) => {
      const modificationDay: string = this.defineModificationDate(entry.modifiedAt);
      if (mappedLists.has(modificationDay)) {
        const mappedList: TimeTrackerEntry[] = mappedLists.get(modificationDay);
        mappedList.push(entry);
        mappedLists.set(modificationDay, mappedList);
      } else {
        mappedLists.set(modificationDay, [entry]);
      }
    });
    const transformedList: Array<{ date: string; list: TimeTrackerEntry[] }> = Array.from(mappedLists.keys()).map(
      (date: string) => {
        return { date, list: mappedLists.get(date) };
      }
    );
    return transformedList;
  }

  private defineModificationDate(date: Date): string {
    const crruentDate: string = moment().format('ddd:DD:MMM:YYYY');
    const entryDate: string = moment(date).format('ddd:DD:MMM:YYYY');
    if (crruentDate === entryDate) {
      return 'Today';
    }
    const timeParts: string[] = entryDate.split(':');
    timeParts[0] = `${timeParts[0]},`;
    return entryDate.split(':').splice(0, timeParts.length).join(' ');
  }
}
