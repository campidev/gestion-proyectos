import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'https://webminube.ddns.net/campidev/auth/api/auth';

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      tap(() => {}),
      switchMap(() =>
        this.http.post<{ accessToken: string }>(
          `${this.apiUrl}/refresh`,
          {},
          { withCredentials: true }
        ).pipe(
          map(res => AuthActions.refreshTokenSuccess({ accessToken: res.accessToken })),
          catchError(() => {
            this.router.navigate(['/auth/login']);
            return of(AuthActions.logout());
          })
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.http.post<{ accessToken: string }>(
          `${this.apiUrl}/refresh`,
          {},
          { withCredentials: true }
        ).pipe(
          map(res => AuthActions.refreshTokenSuccess({ accessToken: res.accessToken })),
          catchError(() => {
            this.router.navigate(['/auth/login']);
            return of(AuthActions.logout());
          })
        )
      )
    )
  );
}
