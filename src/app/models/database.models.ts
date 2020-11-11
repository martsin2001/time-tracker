import { TimeTrackerEntry } from './time-tracker-entry.models';

export interface DatabaseModel {
  activeEntry: TimeTrackerEntry['id'] | null;
  updateEntry: TimeTrackerEntry['id'] | null;
  entriesList: TimeTrackerEntry[];
}
