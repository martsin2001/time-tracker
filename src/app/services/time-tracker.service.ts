import { Inject, Injectable } from '@angular/core';
import { TimeTrackerApi } from '@time-tracker/api';
import { DATABASE_DEFAULT_MODEL, TIME_TRACKER_LOCAL_STORAGE } from '@time-tracker/constants';
import { CommonResponse, DatabaseModel, TimeTrackerEntry } from '@time-tracker/models';
import { Observable, of } from 'rxjs';

@Injectable()
export class TimeTrackerService implements TimeTrackerApi {
  constructor(@Inject(DATABASE_DEFAULT_MODEL) private databaseDefaultModel: DatabaseModel) {
    this.initDatabaseModel();
  }

  upsertEntry(entry: TimeTrackerEntry): Observable<CommonResponse> {
    const data: DatabaseModel = this.getDatabaseModel;
    const updateEntriesList = data.entriesList.filter((e) => e.id !== entry.id);
    updateEntriesList.push(entry);
    localStorage.setItem(TIME_TRACKER_LOCAL_STORAGE, JSON.stringify({ ...data, entriesList: updateEntriesList }));
    return of({ sussces: true });
  }

  updateState(state): Observable<CommonResponse> {
    const data: DatabaseModel = this.getDatabaseModel;
    localStorage.setItem(TIME_TRACKER_LOCAL_STORAGE, JSON.stringify({ ...data, ...state }));
    return of({ sussces: true });
  }

  findOneById(id: TimeTrackerEntry['id']): Observable<CommonResponse> {
    const data: DatabaseModel = this.getDatabaseModel;
    const entry: TimeTrackerEntry = data.entriesList.find((e) => e.id === id);
    return of({ sussces: true, result: entry });
  }

  getAllEntries(): Observable<TimeTrackerEntry[]> {
    const data: DatabaseModel = this.getDatabaseModel;
    return of(data.entriesList);
  }

  getTimeTrackerState(): Observable<DatabaseModel> {
    return of(this.getDatabaseModel);
  }

  resetState(): Observable<CommonResponse> {
    const data: DatabaseModel = this.getDatabaseModel;
    data.activeEntry = null;
    data.updateEntry = null;
    localStorage.setItem(TIME_TRACKER_LOCAL_STORAGE, JSON.stringify(data));
    return of({ sussces: true });
  }

  private initDatabaseModel(): void {
    if (!this.isTimeTrackerStorageCreated) {
      this.createDatabaseModel();
    }
  }

  private createDatabaseModel(): void {
    const data: string = JSON.stringify(this.databaseDefaultModel);
    localStorage.setItem(TIME_TRACKER_LOCAL_STORAGE, data);
  }

  private get getDatabaseModel() {
    return JSON.parse(localStorage.getItem(TIME_TRACKER_LOCAL_STORAGE));
  }

  private get isTimeTrackerStorageCreated(): boolean {
    return !!localStorage.getItem(TIME_TRACKER_LOCAL_STORAGE);
  }
}
