import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-password-dialog.component.html',
  styleUrls: ['./user-password-dialog.component.css'],
})
export class UserPasswordDialogComponent {
  passwordForm: FormGroup;
showPassword = false;
showConfirmPassword = false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
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

  onSave(): void {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.get('password')?.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
   togglePasswordVisibility(field: 'password' | 'confirm') {
  if (field === 'password') {
    this.showPassword = !this.showPassword;
  } else {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
}