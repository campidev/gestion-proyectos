import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { selectRole } from 'shared-state';
import { AuthState } from 'shared-state';
import { Store } from '@ngrx/store';
@Injectable({ providedIn: 'root' })
export class AuthRemoteService {
  private authServiceInstance: any;
roleValue: string = '';
  constructor(private store: Store<{ auth: AuthState }>) {
    this.store.select(selectRole).subscribe(role => {
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
      this.authServiceInstance = new module.AuthService();
    }
  }

  async isLoggedIn(): Promise<boolean> {
    await this.init();
    return this.authServiceInstance.isLoggedIn();
  }

  hasRole(roles: string[]): boolean {
  // Convertimos el rol del usuario en array, por si es "ADMIN,USER"
  const userRoles = String(this.roleValue).split(',').map(r => r.trim());

  // Retorna true si alguno de los roles requeridos está presente en los roles del usuario
  return roles.some(role => userRoles.includes(role));
}

}
