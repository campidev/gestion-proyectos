// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { 
  AbstractControl, 
  FormBuilder, 
  FormGroup, 
  FormsModule, 
  ReactiveFormsModule, 
  ValidationErrors, 
  Validators 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Role, RegisterRequest } from '../../models/register-request.model';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [           
    ReactiveFormsModule,
    FormsModule,  
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink
   
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  roles = Object.values(Role);

  loading = false;
  successMessage = '';
  errorMessage = '';

  // Regex para validaciones visuales
  private readonly UPPER = /[A-Z]/;
  private readonly LOWER = /[a-z]/;
  private readonly SPECIAL = /[^A-Za-z0-9]/;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: [
          '', 
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$')
          ]
        ],
        confirmPassword: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        lastName: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ---- Métodos ----
  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const request: RegisterRequest = this.registerForm.value;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.register(request).subscribe({
      next: (value:any) => {
        this.successMessage = 'Registro exitoso 🎉'+value.message;
        this.registerForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error en el registro';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  // ---- Getters ----
  get password(): string {
    return this.registerForm.get('password')?.value || '';
  }

  get confirmPassword(): string {
  return this.registerForm.get('confirmPassword')?.value || '';
}


  get hasMinLength(): boolean { return this.password.length >= 8; }
  get hasUpper(): boolean { return this.UPPER.test(this.password); }
  get hasLower(): boolean { return this.LOWER.test(this.password); }
  get hasSpecial(): boolean { return this.SPECIAL.test(this.password); }
  get passwordsMatch(): boolean {
  return !!this.password && !!this.confirmPassword && this.password === this.confirmPassword;
}
  // ---- Validadores ----
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
}
