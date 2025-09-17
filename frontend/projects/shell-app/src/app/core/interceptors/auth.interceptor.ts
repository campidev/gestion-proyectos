import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError, take, switchMap, catchError } from 'rxjs';
import { selectToken, AuthState } from 'shared-state';
import { AuthRemoteService } from '../services/AuthRemotes.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService: AuthRemoteService = inject(AuthRemoteService);
  const store: Store<AuthState> = inject(Store);
  if (
    req.url.includes('/refresh') ||
    req.url.includes('/login') ||
    req.url.includes('/recovery') ||
    req.url.includes('/reset')
  ) {
    return next(req);
  }
  // Función para agregar token a la request
  const addToken = (req: HttpRequest<any>, token?: string | null) => {
    if (!token) return req;
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  };

  // Manejo de la request con catch de 401
  const handleRequest = (request: HttpRequest<any>) =>
    next(request).pipe(
      catchError((err) => {
        if (err.status === 403 || err.status === 401) {
          // Si hay 401, hacemos refresh token
          return authService.refreshToken().pipe(
            switchMap(() =>
              store.select(selectToken).pipe(
                take(1),
                switchMap((newToken) => next(addToken(req, newToken)))
              )
            )
          );
        }
        return throwError(() => err);
      })
    );

  // Obtenemos el token inicial y lanzamos la request
  return store.select(selectToken).pipe(
    take(1),
    switchMap((token) => handleRequest(addToken(req, token)))
  );
};
