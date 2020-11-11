import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, interval, merge, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { TimeTrackerEntry } from '@time-tracker/models';
import { Data } from '@angular/router';
import * as uuid from 'uuid-random';
import * as moment from 'moment';
import 'moment-duration-format';
import { TimeTrackerFacade } from '@time-tracker/state';

@Component({
  selector: 'app-time-tracker-form',
  templateUrl: './time-tracker-form.component.html',
  styleUrls: ['./time-tracker-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTrackerFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() startTracking: EventEmitter<TimeTrackerEntry> = new EventEmitter();
  @Output() stopTracking: EventEmitter<TimeTrackerEntry> = new EventEmitter();
  @Output() disconnectTracking: EventEmitter<TimeTrackerEntry> = new EventEmitter();

  @ViewChild('timeField', { static: true }) timeField: ElementRef<HTMLInputElement>;

  timeTrackerForm: FormGroup;
  inProgress$: Observable<boolean> = this.timeTrackerFacade.selectActiveEntry$.pipe(
    tap((entryId: TimeTrackerEntry['id']) => (this.activeEntryId = entryId)),
    map((entryId: TimeTrackerEntry['id']) => uuid.test(entryId))
  );
  duration$: BehaviorSubject<number> = new BehaviorSubject(0);
  projects: string[] = ['First Project', 'Second Project', 'Third Project'];
  activeEntryId: TimeTrackerEntry['id'];
  selectedEntry: TimeTrackerEntry;

  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly disableChecking$: Subject<void> = new Subject<void>();
  private readonly stopTracking$: Subject<void> = new Subject<void>();

  constructor(
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private timeTrackerFacade: TimeTrackerFacade,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createTimeTrackerForm();
    this.determineActiveEntry();
    this.subscribeToUpdateEntry();
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy(): Promise<void> {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopTracking$.next();
    this.stopTracking$.complete();
    if (!!this.activeEntryId) {
      this.onDisconnectTracking();
    }
  }

  ngAfterViewInit(): void {
    this.disableTimeFieldModifications();
  }

  start(): void {
    this.timeTrackerForm.disable();
    const formValue: Partial<TimeTrackerEntry> = this.timeTrackerForm.value;
    if (!this.selectedEntry) {
      this.selectedEntry = {
        project: formValue.project,
        description: formValue.description,
        disconnectedAt: null,
        startedAt: new Date(),
        modifiedAt: new Date(),
        stopedAt: null,
        id: uuid(),
      };
    } else {
      this.selectedEntry.modifiedAt = new Date();
      this.selectedEntry.project = formValue.project;
      this.selectedEntry.description = formValue.description;
    }
    this.startTracking.next(this.selectedEntry);
    this.subscribeToTracker();
  }

  stop(): void {
    this.timeTrackerForm.enable();
    this.selectedEntry = {
      ...this.selectedEntry,
      stopedAt: moment(this.selectedEntry.startedAt).add(this.duration$.value, 'seconds').toDate(),
    };
    this.stopTracking.next(this.selectedEntry);
    this.selectedEntry = null;
    this.stopTracking$.next();
    this.resetForm();
  }

  private resetForm(): void {
    this.duration$.next(0);
    this.timeTrackerForm.updateValueAndValidity();
    this.timeTrackerForm.reset();
  }

  private onDisconnectTracking(): void {
    const selectedEntry: TimeTrackerEntry = {
      ...this.selectedEntry,
      stopedAt: moment(this.selectedEntry.startedAt).add(this.duration$.value, 'seconds').toDate(),
      disconnectedAt: new Date(),
    };
    this.disconnectTracking.next(selectedEntry);
  }

  private determineActiveEntry(): void {
    this.timeTrackerFacade.selectActiveEntry$
      .pipe(
        filter((value) => value !== undefined),
        takeUntil(this.disableChecking$)
      )
      .subscribe((entryId: TimeTrackerEntry['id']) => {
        if (uuid.test(entryId)) {
          this.continueTracking(entryId);
        }
        this.disableChecking$.next();
        this.disableChecking$.complete();
      });
  }

  private continueTracking(entryId: TimeTrackerEntry['id']): void {
    this.loadEntryById(entryId)
      .pipe(take(1))
      .subscribe((entry: TimeTrackerEntry) => {
        this.populateForm(entry);
        this.timeTrackerForm.disable();
        this.selectedEntry = { ...entry };
        const difference: number = moment().diff(moment(entry.disconnectedAt), 'seconds');
        this.defineDuration(entry.startedAt, moment(entry.stopedAt).add(difference, 'seconds'));
        this.subscribeToTracker();
      });
  }

  private subscribeToTracker() {
    interval(1000)
      .pipe(takeUntil(this.stopTracking$))
      .subscribe(() => {
        let current: number = this.duration$.value;
        this.duration$.next(++current);
      });
  }

  private createTimeTrackerForm(): void {
    this.timeTrackerForm = this.fb.group({
      project: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  private populateForm(entry: Partial<TimeTrackerEntry>): void {
    this.timeTrackerForm.patchValue(entry);
  }

  private subscribeToUpdateEntry(): void {
    this.timeTrackerFacade.selectUpdateEntry$
      .pipe(
        filter(uuid.test),
        switchMap((entryId: TimeTrackerEntry['id']) => this.loadEntryById(entryId).pipe(take(1))),
        takeUntil(this.destroy$)
      )
      .subscribe((entry: TimeTrackerEntry) => {
        const activeEntryId: TimeTrackerEntry['id'] = this.activeEntryId;
        if (uuid.test(activeEntryId)) {
          this.stop();
        }
        this.populateForm(entry);
        this.selectedEntry = { ...entry };
        this.defineDuration(entry.startedAt, entry.stopedAt);
      });
  }

  private defineDuration(startedAt: Data, stopedAt: Data): void {
    const started = moment(startedAt);
    const stoped = moment(stopedAt);
    this.duration$.next(stoped.diff(started, 'seconds'));
  }

  private loadEntryById(entryId: TimeTrackerEntry['id']): Observable<TimeTrackerEntry> {
    return this.timeTrackerFacade.findOneById(entryId);
  }

  private disableTimeFieldModifications(): void {
    const runOutsideAngular = (target: EventTarget, eventName: string): Observable<KeyboardEvent> =>
      this.zone.runOutsideAngular(() =>
        fromEvent(target, eventName).pipe(tap((event: KeyboardEvent) => event.preventDefault()))
      );
    const inputFieldTarget: HTMLInputElement = this.timeField.nativeElement;
    const obsevarbles: Observable<KeyboardEvent>[] = [runOutsideAngular(inputFieldTarget, 'keydown')];
    merge(...obsevarbles)
      .pipe(
        tap(() => this.showSnackBar('This field cannot be adjusted')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, null, { duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom' });
  }
}
