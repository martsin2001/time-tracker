import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerEntriesListComponent } from './time-tracker-entries-list.component';

describe('TimeTrackerEntriesListComponent', () => {
  let component: TimeTrackerEntriesListComponent;
  let fixture: ComponentFixture<TimeTrackerEntriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeTrackerEntriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackerEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
