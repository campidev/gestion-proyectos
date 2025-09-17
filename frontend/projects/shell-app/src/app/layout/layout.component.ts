import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectName } from 'shared-state';
import { AuthRemoteService } from '../core/services/AuthRemotes.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  isDesktop = true;
  isLoggedIn$: Observable<boolean>;
  name$: Observable<string | null>;
  constructor(
    private authService: AuthRemoteService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private store: Store
  ) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.name$ = this.store.select(selectName);
  }
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result) => {
        this.isDesktop = result.matches; // true si estamos en pantallas medianas o grandes
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }

  logout(): void {
    this.authService.logoutRequest().subscribe({
      next: () => this.handleLogout(),
      error: () => this.handleLogout(),
    });
  }

  private handleLogout(): void {
    this.authService.clearToken();
    this.router.navigate(['/auth/login']);
  }
}
