import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { TimeTrackerEntry } from '@time-tracker/models';
import * as Actions from './time-tracker.actions';

export interface TimeTrackerState extends EntityState<TimeTrackerEntry> {
  activeEntry: TimeTrackerEntry['id'] | null;
  updateEntry: TimeTrackerEntry['id'] | null;
}

export const adapter: EntityAdapter<TimeTrackerEntry> = createEntityAdapter<TimeTrackerEntry>();

export const initialState: TimeTrackerState = adapter.getInitialState({
  activeEntry: null,
  updateEntry: null,
});

const timeTrackerReducer = createReducer(
  initialState,
  on(Actions.upsertState, (state, { state: newState }) => {
    return adapter.setAll(newState.entriesList, {
      ...state,
      activeEntry: newState.activeEntry,
      updateEntry: newState.updateEntry,
    });
  }),
  on(Actions.allEntriesLoaded, (state, { entries }) => {
    return adapter.upsertMany(entries, state);
  }),
  on(Actions.upsertOneEntry, (state, { entry }) => {
    return adapter.upsertOne(entry, state);
  }),
  on(Actions.setActiveEntry, (state, { id }) => {
    return { ...state, activeEntry: id };
  }),
  on(Actions.setEntryForUpdate, (state, { id }) => {
    return { ...state, updateEntry: id };
  }),
  on(Actions.resetState, (state) => {
    return { ...state, activeEntry: null, updateEntry: null };
  })
);

export function reducer(state: TimeTrackerState | undefined, action: Action) {
  return timeTrackerReducer(state, action);
}

export const { selectAll } = adapter.getSelectors();
