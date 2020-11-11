import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Selectors from './time-tracker.selectors';
import * as Actions from './time-tracker.actions';
import { TimeTrackerEntry } from '@time-tracker/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TimeTrackerFacade {
  selectAllEntries$ = this.store.select(Selectors.selectAllEntries);
  selectActiveEntry$ = this.store.select(Selectors.selectActiveEntry);
  selectUpdateEntry$ = this.store.select(Selectors.selectUpdateEntry);

  constructor(private store: Store) {}

  findOneById(id: TimeTrackerEntry['id']): Observable<TimeTrackerEntry> {
    return this.selectAllEntries$.pipe(
      map((entries: TimeTrackerEntry[]) => entries.find((entry: TimeTrackerEntry) => entry.id === id))
    );
  }

  initState(): void {
    this.store.dispatch(Actions.initState());
  }

  loadAllEntries(): void {
    this.store.dispatch(Actions.loadAllEntries());
  }

  upsertEntry(entry: TimeTrackerEntry): void {
    this.store.dispatch(Actions.upsertOneEntry({ entry }));
  }

  setActiveEntry(id: TimeTrackerEntry['id'] | null): void {
    this.store.dispatch(Actions.setActiveEntry({ id }));
  }

  setEntryForUpdate(id: TimeTrackerEntry['id'] | null): void {
    this.store.dispatch(Actions.setEntryForUpdate({ id }));
  }

  resetState(): void {
    this.store.dispatch(Actions.resetState());
  }
}
