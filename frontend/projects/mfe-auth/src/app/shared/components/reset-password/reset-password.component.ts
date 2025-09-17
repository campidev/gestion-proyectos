import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from "@angular/material/icon";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatCard } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-reset-password',
  standalone:true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [MatIcon, MatError, MatFormField, MatLabel, MatCard,ReactiveFormsModule,CommonModule,CommonModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      ReactiveFormsModule]
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  token: string | null = null;
showPassword = false;
showConfirmPassword = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group(
       {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );    
  }

  ngOnInit(): void {
    // Obtener token de la URL: /reset-password?token=xxxx
    this.token = this.route.snapshot.queryParamMap.get('token');
    
  }

   // Validación de coincidencia
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  // Getters de validaciones
  get password(): string {
    return this.passwordForm.get('password')?.value || '';
  }
  get hasMinLength(): boolean {
    return this.password.length >= 8;
  }
  get hasUpper(): boolean {
    return /[A-Z]/.test(this.password);
  }
  get hasLower(): boolean {
    return /[a-z]/.test(this.password);
  }
  get hasSpecial(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
  }
  get passwordsMatch(): boolean {
    return this.passwordForm.valid && !this.passwordForm.hasError('passwordMismatch');
  }


  onSave() {
    if (!this.token || this.passwordForm.invalid) return;

    this.loading = true;
    const newPassword = this.passwordForm.get('password')?.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: res => {
        alert(res.message || 'Contraseña actualizada con éxito');
        this.router.navigate(['/login']); // redirigir al login
      },
      error: err => {
        
        alert(err.error?.error || 'Error al cambiar la contraseña');
        this.loading = false;
      }
    });
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
  if (field === 'password') {
    this.showPassword = !this.showPassword;
  } else {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
}
