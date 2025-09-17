import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './shared/components/profile/profile.component';


export const PROFILE_ROUTES: Routes = [
  { path: 'profile', component: ProfileComponent },
];

export const RolesRoutingModule = RouterModule.forChild(PROFILE_ROUTES);
