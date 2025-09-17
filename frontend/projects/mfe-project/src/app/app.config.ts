import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { PROJECT_ROUTES } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { provideStore } from '@ngrx/store';
import { authReducer } from 'shared-state';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(PROJECT_ROUTES),provideAnimationsAsync(),
    provideHttpClient(),importProvidersFrom(MatNativeDateModule),provideStore({ auth: authReducer }),provideEffects([]) ]
};
