import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { selectAuthState, AuthState } from 'shared-state';
import * as AuthActions from 'shared-state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(selectAuthState).pipe(
      take(1),
      switchMap((authState: AuthState) => {
        if (authState.token) {
          const isExpired = this.tokenExpired(authState.token);

          if (isExpired) {
            // 🔹 dispara acción para refrescar
            this.store.dispatch(AuthActions.refreshToken());
            // deja pasar provisionalmente; el Effect decidirá si redirige
            return of(true);
          }

          // 🔹 Validar roles si están definidos en la ruta
          // Obtener roles requeridos de la ruta
          let requiredRoles: string[] = [];
          const routeRoles = route.data['roles'];

          if (routeRoles) {
            if (typeof routeRoles === 'string') {
              // Si está definido como string "ADMIN,USER"
              requiredRoles = routeRoles.split(',').map((r) => r.trim());
            } else if (Array.isArray(routeRoles)) {
              // Si está definido como array ['ADMIN','USER']
              requiredRoles = routeRoles;
            }
          }

          // Roles del usuario autenticado (pueden ser "ADMIN" o "ADMIN,USER")
          const userRoles = String(authState.role)
            .split(',')
            .map((r) => r.trim());

          // Verificar si alguno de los roles del usuario coincide con los requeridos
          const hasRole =
            requiredRoles.length === 0 ||
            userRoles.some((r) => requiredRoles.includes(r));

          if (!hasRole) {
            this.router.navigate(['/unauthorized']);
            return of(false);
          }

          return of(true);
        } else {
          this.router.navigate(['/auth/login']);
          return of(false);
        }
      })
    );
  }

  private tokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // exp en ms
      return Date.now() > exp;
    } catch {
      return true;
    }
  }
}
