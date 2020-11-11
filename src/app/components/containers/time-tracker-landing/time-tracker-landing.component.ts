import { Component, OnInit } from '@angular/core';
import { TimeTrackerEntry } from '@time-tracker/models';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TimeTrackerFacade } from '@time-tracker/state';

@Component({
  selector: 'app-time-tracker-landing',
  templateUrl: './time-tracker-landing.component.html',
  styleUrls: ['./time-tracker-landing.component.scss'],
})
export class TimeTrackerLandingComponent implements OnInit {
  readonly entriesList$: Observable<TimeTrackerEntry[]> | any = this.timeTrackerFacade.selectAllEntries$.pipe(
    switchMap((entries: TimeTrackerEntry[]) =>
      this.timeTrackerFacade.selectActiveEntry$.pipe(map((activeEntryId: string) => ({ entries, activeEntryId })))
    ),
    map(({ entries, activeEntryId }) => [...entries.filter((entry: TimeTrackerEntry) => entry.id !== activeEntryId)])
  );

  constructor(private timeTrackerFacade: TimeTrackerFacade) {
    this.timeTrackerFacade.initState();
  }

  ngOnInit() {}

  updateEntry(entryId: TimeTrackerEntry['id']): void {
    this.timeTrackerFacade.setEntryForUpdate(entryId);
  }

  startTracking(entry: TimeTrackerEntry): void {
    this.timeTrackerFacade.setEntryForUpdate(null);
    this.timeTrackerFacade.setActiveEntry(entry.id);
    this.timeTrackerFacade.upsertEntry(entry);
  }

  stopTracking(entry: TimeTrackerEntry): void {
    this.timeTrackerFacade.resetState();
    this.timeTrackerFacade.upsertEntry(entry);
  }

  disconnectTracking(entry: TimeTrackerEntry): void {
    this.timeTrackerFacade.upsertEntry(entry);
  }
}
