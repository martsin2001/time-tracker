import { NgModule } from '@angular/core';
import { TimeTrackerLandingComponent } from './containers/time-tracker-landing/time-tracker-landing.component';
import { TimeTrackerFormComponent } from './presentational/time-tracker-form/time-tracker-form.component';
import { TimeTrackerEntriesListComponent } from './presentational/time-tracker-entries-list/time-tracker-entries-list.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DurationPipe, EntriesListPipe, TimerPipe } from '@time-tracker/pipes';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  declarations: [
    TimeTrackerLandingComponent,
    TimeTrackerFormComponent,
    TimeTrackerEntriesListComponent,
    TimerPipe,
    EntriesListPipe,
    DurationPipe,
  ],
  exports: [TimeTrackerLandingComponent],
})
export class ComponentsModule {}
