import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'mfeAuth',
        exposedModule: './AuthRoutes'   
      }).then(m => m.AUTH_ROUTES)       
  },
  {
    path: '',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'mfeAuth',
        exposedModule: './RolesRoutes'   
      }).then(m => m.ROLES_ROUTES)       
  },
  {
    path: '',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'mfeAuth',
        exposedModule: './ProfileRoutes'   
      }).then(m => m.PROFILE_ROUTES)       
  }
 
];

