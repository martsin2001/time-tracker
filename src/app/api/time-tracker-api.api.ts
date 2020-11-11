import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponse } from '../models/common-response.models';
import { DatabaseModel } from '../models/database.models';
import { TimeTrackerEntry } from '../models/time-tracker-entry.models';

@Injectable({ providedIn: 'root' })
export abstract class TimeTrackerApi {
  abstract getAllEntries(): Observable<TimeTrackerEntry[]>;

  abstract upsertEntry(entry: TimeTrackerEntry): Observable<CommonResponse>;

  abstract findOneById(id: TimeTrackerEntry['id']): Observable<CommonResponse>;

  abstract getTimeTrackerState(): Observable<DatabaseModel>;

  abstract updateState(state: { activeEntry?: string | null; updateEntry?: string | null }): Observable<CommonResponse>;

  abstract resetState(): Observable<CommonResponse>;
}
