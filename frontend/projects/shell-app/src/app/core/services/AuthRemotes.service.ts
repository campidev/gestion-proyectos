import { Injectable, Injector } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

import { AuthState } from 'shared-state';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  logout,
  selectToken,
  selectRole,
  refreshTokenSuccess,
} from 'shared-state';

@Injectable({ providedIn: 'root' })
export class AuthRemoteService {
  private authServiceInstance: any;
  roleValue: string = '';
 private apiUrl = 'https://webminube.ddns.net/campidev/auth/api/auth';
  constructor(
    private store: Store<{ auth: AuthState }>,
    private injector: Injector,
    private http: HttpClient
  ) {
    this.init();
    this.store.select(selectRole).subscribe((role) => {
      this.roleValue = role as string; // almacena el rol actual
    });
  }

  private async init() {
    if (!this.authServiceInstance) {
      const module = await loadRemoteModule({
        remoteEntry: 'https://tcc.campidev.com/mfe-auth/remoteEntry.js', // shell
        remoteName: 'mfeAuth',
        exposedModule: './AuthService'
      });

      const AuthServiceClass = module.AuthService;
      // 👇 Esto asegura que Angular inyecte las dependencias
      this.authServiceInstance = this.injector.get(AuthServiceClass);
    }
  }

  isLoggedIn(): boolean {
    if (!this.authServiceInstance) {
      return false; // aún no cargado
    }
    return this.authServiceInstance.isLoggedIn();
  }

  hasRole(roles: string[]): boolean {
    const userRoles = String(this.roleValue)
      .split(',')
      .map((r) => r.trim());

    return roles.some((role) => userRoles.includes(role));
  }

  clearToken(): void {
    this.store.dispatch(logout());
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
}
