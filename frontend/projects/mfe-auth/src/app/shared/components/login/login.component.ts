// src/app/modules/login/login.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { provideStore, Store, StoreModule, StoreRootModule } from '@ngrx/store';
import { login, logout } from 'shared-state';
import { AuthState } from 'shared-state';
import { EffectsModule } from '@ngrx/effects';
import { Router, RouterLink } from '@angular/router';
import { LoginResponse } from '../../models/login-response.model';
import { MatDialog } from '@angular/material/dialog';
import { RecoverPasswordDialogComponent } from '../recover-password-dialog/recover-password-dialog.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<{ auth: AuthState }>,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: LoginResponse) => {
        this.store.dispatch(login({ token: res.token }));
        this.router.navigate(['']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error.message || 'Credenciales inválidas';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onLogout() {
    this.store.dispatch(logout());
  }

  openRecoverDialog() {
  this.dialog.open(RecoverPasswordDialogComponent, {
    width: '400px'
  });
}
}
