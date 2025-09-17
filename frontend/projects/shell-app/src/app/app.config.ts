import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects, authReducer } from 'shared-state';
import { MatNativeDateModule } from '@angular/material/core';
import { authInterceptor} from './core/interceptors/auth.interceptor';
const shouldRunInitEffect = !window.location.pathname.includes('/reset');
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
     provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({}), // 🔹 equivalente a StoreModule.forRoot({})
    provideState('auth', authReducer), // 🔹 equivalente a StoreModule.forFeature
     shouldRunInitEffect ? provideEffects(AuthEffects) : [],
    MatNativeDateModule
   
  ],
};
