import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './shared/components/unauthorized.component';

export const routes: Routes = [

 {
  path: 'auth',
  loadChildren: () =>
    import('./micro-frontends/auth-mf/auth-mf.routes').then(m => m.APP_ROUTES),
}, 

{
  path: 'dashboard',
  component: LayoutComponent,
  canActivate: [AuthGuard],  
  children: [
    {
      path: 'projects',
      loadChildren: () =>
        import('./micro-frontends/project-mf/project-mf.routes').then(m => m.APP_ROUTES),
      data: { roles: ['ADMIN', 'USER'] },
    },
    {
      path: 'roles',
      loadChildren: () =>
        import('./micro-frontends/auth-mf/auth-mf.routes').then(m => m.APP_ROUTES),
      canActivate: [AuthGuard],  
      data: { roles: ['ADMIN'] },
    },
    {
      path: 'profile',
      loadChildren: () =>
        import('./micro-frontends/auth-mf/auth-mf.routes').then(m => m.APP_ROUTES),
      canActivate: [AuthGuard],  
      data: { roles: ['ADMIN', 'USER'] },
    },
    { path: '', redirectTo: 'projects/proyectos', pathMatch: 'full' },
  ],
},

{ path: 'unauthorized', component: UnauthorizedComponent },
{ path: '', component: LayoutComponent,canActivate: [AuthGuard],},
  // Cualquier ruta no encontrada redirige
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
