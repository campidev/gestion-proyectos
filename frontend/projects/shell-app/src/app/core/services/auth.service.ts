import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectToken, selectRole } from 'shared-state';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token$: Observable<string | null>;
  isLoggedIn$: Observable<boolean>;
  role$: Observable<string | null>;

  constructor(
    private store: Store,
    private router: Router,
    private http: HttpClient
  ) {
    this.token$ = this.store.select(selectToken);

    this.isLoggedIn$ = this.token$.pipe(
      map((token) => {
        return true;
      })
    );

    this.role$ = this.store.select(selectRole);
  }

  getToken(): Observable<string | null> {
    return this.token$;
  }

  setToken(token: string): void {}

  private hasValidToken(token?: string): boolean {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  getTokenSync(): string | null {
    return localStorage.getItem('auth_token');
  }
}
