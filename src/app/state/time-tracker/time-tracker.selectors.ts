import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll, TimeTrackerState } from './time-tracker.reducer';

export const selectState = createFeatureSelector<{ trackerState: TimeTrackerState }, TimeTrackerState>('trackerState');

export const selectAllEntries = createSelector(selectState, selectAll);
export const selectActiveEntry = createSelector(selectState, (state) => state.activeEntry);
export const selectUpdateEntry = createSelector(selectState, (state) => state.updateEntry);
