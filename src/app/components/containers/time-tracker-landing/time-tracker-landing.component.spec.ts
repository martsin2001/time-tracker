import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerLandingComponent } from './time-tracker-landing.component';

describe('TimeTrackerLandingComponent', () => {
  let component: TimeTrackerLandingComponent;
  let fixture: ComponentFixture<TimeTrackerLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeTrackerLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackerLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
