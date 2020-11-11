import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TimeTrackerEntry } from '@time-tracker/models';

@Component({
  selector: 'app-time-tracker-entries-list',
  templateUrl: './time-tracker-entries-list.component.html',
  styleUrls: ['./time-tracker-entries-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTrackerEntriesListComponent implements OnInit {
  @Input() entriesList: TimeTrackerEntry[];
  @Output() updateEntry = new EventEmitter<TimeTrackerEntry['id']>();

  constructor() {}

  ngOnInit() {}

  play(entryId: TimeTrackerEntry['id']): void {
    this.updateEntry.next(entryId);
  }
}
