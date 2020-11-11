import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map, switchMap, take, tap } from 'rxjs/operators';
import { TimeTrackerApi } from '@time-tracker/api';
import { DatabaseModel, TimeTrackerEntry } from '@time-tracker/models';
import * as FromAtions from './time-tracker.actions';

@Injectable()
export class TimeTrackerEffects {
  constructor(private actions$: Actions, private timeTrackerApi: TimeTrackerApi) {}

  upsertState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FromAtions.initState),
      exhaustMap(() => {
        return this.timeTrackerApi.getTimeTrackerState().pipe(
          take(1),
          map((state: DatabaseModel) => FromAtions.upsertState({ state }))
        );
      })
    )
  );

  loadAllEntries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FromAtions.loadAllEntries),
      concatMap(() => {
        return this.timeTrackerApi.getAllEntries().pipe(
          take(1),
          map((entries: TimeTrackerEntry[]) => FromAtions.allEntriesLoaded({ entries }))
        );
      })
    )
  );

  upsertOneEntry$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FromAtions.upsertOneEntry),
        concatMap((action) => this.timeTrackerApi.upsertEntry(action.entry).pipe(take(1)))
      ),
    { dispatch: false }
  );

  setActiveEntry$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FromAtions.setActiveEntry),
        switchMap((action) => this.timeTrackerApi.updateState({ activeEntry: action.id }).pipe(take(1)))
      ),
    { dispatch: false }
  );

  setEntryForUpdate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FromAtions.setEntryForUpdate),
        switchMap((action) => this.timeTrackerApi.updateState({ updateEntry: action.id }).pipe(take(1)))
      ),
    { dispatch: false }
  );

  resetState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FromAtions.resetState),
        switchMap(() => this.timeTrackerApi.resetState().pipe(take(1)))
      ),
    { dispatch: false }
  );
}
