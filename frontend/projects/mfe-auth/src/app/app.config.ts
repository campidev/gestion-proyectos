import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authReducer } from 'shared-state';
import { provideHttpClient } from '@angular/common/http';
import { AUTH_ROUTES } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ROLES_ROUTES } from './roles.routes';
import { PROFILE_ROUTES } from './profile.routes';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter([
      ...AUTH_ROUTES,
      ...ROLES_ROUTES,
      ...PROFILE_ROUTES
    ]),provideAnimationsAsync(),
    provideHttpClient(),provideStore({ auth: authReducer }),provideEffects([])]
};
