import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';

import { AppComponent } from './app.component';
import { ComponentsModule } from '@time-tracker/components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeTrackerApi } from '@time-tracker/api';
import { TimeTrackerService } from '@time-tracker/services';
import { DATABASE_DEFAULT_MODEL, LOCAL_STORAGE_MODEL } from '@time-tracker/constants';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@time-tracker/state';
import { EffectsModule } from '@ngrx/effects';
import { TimeTrackerEffects } from './state/time-tracker/time-tracker.effects';

const ROOT_PROVIDERS: Provider[] = [
  { provide: TimeTrackerApi, useClass: TimeTrackerService },
  { provide: DATABASE_DEFAULT_MODEL, useValue: LOCAL_STORAGE_MODEL },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ComponentsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('trackerState', reducer),
    EffectsModule.forRoot([TimeTrackerEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      features: {
        pause: false,
        lock: true,
        persist: true,
      },
    }),
  ],
  providers: ROOT_PROVIDERS,
  bootstrap: [AppComponent],
})
export class AppModule {}
