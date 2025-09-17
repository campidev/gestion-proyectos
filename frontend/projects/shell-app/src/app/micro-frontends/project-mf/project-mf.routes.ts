import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'mfeProject',
        exposedModule: './ProjectRoutes'   
      }).then(m => m.PROJECT_ROUTES)       
  }
 
];

