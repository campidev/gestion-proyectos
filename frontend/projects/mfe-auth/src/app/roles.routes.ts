import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './shared/components/role/roles.component';
import { UsersComponent } from './shared/components/users/users.component';



export const ROLES_ROUTES: Routes = [
  { path: 'roles', component: RolesComponent } ,
  { path: 'users', component: UsersComponent }
 
];

export const RolesRoutingModule = RouterModule.forChild(ROLES_ROUTES);
