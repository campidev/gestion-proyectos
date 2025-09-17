import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthRemoteService } from "../services/AuthRemotes.service";

@Injectable({ providedIn: 'root' })
export class AuthGuardMFE implements CanActivate {

  constructor(private authRemote: AuthRemoteService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    
     
    let requiredRoles: string[] = [];
    const routeRoles = route.data['roles'];
    if (routeRoles) {
      if (typeof routeRoles === 'string') {
        requiredRoles = routeRoles.split(',').map(r => r.trim());
      } else if (Array.isArray(routeRoles)) {
        requiredRoles = routeRoles;
      }
    }    

    // 5️⃣ Validar si tiene al menos uno de los roles
    const hasRole = requiredRoles.length === 0 || this.authRemote.hasRole(routeRoles);

    if (!hasRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
