import { DatabaseModel, TimeTrackerEntry } from '@time-tracker/models';
import { createAction, props } from '@ngrx/store';

export const initState = createAction('[State API] Init');
export const upsertState = createAction('[State API] Upsert', props<{ state: DatabaseModel }>());
export const resetState = createAction('[State API] Reset');

export const loadAllEntries = createAction('[Entry API] Load All');
export const allEntriesLoaded = createAction('[Entry API] All Loaded', props<{ entries: TimeTrackerEntry[] }>());

export const upsertOneEntry = createAction('[Entry API] Upsert One', props<{ entry: TimeTrackerEntry }>());

export const setActiveEntry = createAction('[Entry API] Set Active', props<{ id: TimeTrackerEntry['id'] | null }>());
export const setEntryForUpdate = createAction(
  '[Entry API] Set To Updete',
  props<{ id: TimeTrackerEntry['id'] | null }>()
);
