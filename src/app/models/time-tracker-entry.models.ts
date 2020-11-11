export interface TimeTrackerEntry {
  id: string;
  project: string;
  description: string;
  disconnectedAt: Date;
  modifiedAt: Date;
  startedAt: Date;
  stopedAt: Date;
}
