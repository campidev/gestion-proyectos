import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { RegisterRequest } from '../models/register-request.model';
import { LoginRequest } from '../models/login-request.model';
import { Store } from '@ngrx/store';
import { AuthState } from 'shared-state';
import {
  logout,
  selectToken,
  selectRole,
  refreshTokenSuccess,
} from 'shared-state';
import { Router } from '@angular/router';
import { LoginResponse } from '../models/login-response.model';
import { RecoveryRequest } from '../models/recovery-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://webminube.ddns.net/campidev/auth/api/auth'; // Ajusta la URL según tu backend
  //private apiUrl = 'http://localhost:9095/auth/api/auth'; // Ajusta la URL según tu backend
  roleValue: string = '';
  token$: Observable<string | null>;
  isLoggedIn$: Observable<boolean>;
  role$: Observable<string | null>;
  constructor(
    private http: HttpClient,
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.token$ = this.store.select(selectToken);

    // isLoggedIn$ siempre refleja la validez actual del token
    this.store.select(selectRole).subscribe((role) => {
      this.roleValue = role as string; // almacena el rol actual
    });
    this.isLoggedIn$ = this.token$.pipe(
      map((token) => {
        return true;
  
      })
    );

    this.role$ = this.store.select(selectRole);
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request, {
      withCredentials: true,
    });
  }
  recovery(request: RecoveryRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/recovery`, request, {
      withCredentials: true,
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    });
  }

  refreshToken() {
    return this.http
      .post<{ accessToken: string }>(
        this.apiUrl + '/refresh',
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          // 🔑 Actualiza el token en el store
          this.store.dispatch(
            refreshTokenSuccess({ accessToken: res.accessToken })
          );
        })
      );
  }

  logoutRequest(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

  // Logout en el cliente
  logout(): void {
    // Si guardas el accessToken en memoria/localStorage → lo eliminas

    this.clearToken();
    // Rediriges al login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    let value = false;
    this.isLoggedIn$.subscribe((v) => (value = v)).unsubscribe();
    if (value == false) {
      this.router.navigate(['/auth/login']);
    }
    return value;
  }

  hasRole(roles: string[]): boolean {
    // Convertimos el rol del usuario en array, por si es "ADMIN,USER"
    const userRoles = String(this.roleValue)
      .split(',')
      .map((r) => r.trim());

    // Retorna true si alguno de los roles requeridos está presente en los roles del usuario
    return roles.some((role) => userRoles.includes(role));
  }

  clearToken(): void {
    // Aquí despachas logout o limpiar token en NgRx
    this.store.dispatch(logout());
  }
}
