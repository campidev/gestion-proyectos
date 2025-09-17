import { RecoveryRequest } from './../../models/recovery-request.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
@Component({
  standalone: true,
  selector: 'app-recover-password-dialog',
  templateUrl: './recover-password-dialog.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatDialogActions,
    CommonModule,
  ],
})
export class RecoverPasswordDialogComponent {
  loading = false;
  recoverForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecoverPasswordDialogComponent>,
    private authService: AuthService
  ) {
    this.recoverForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onRecover() {
    if (this.recoverForm.invalid) return;
    this.loading = true;
    let request: RecoveryRequest = this.recoverForm.getRawValue();
    this.authService.recovery(request).subscribe({
      next: (value: any) => {
        alert(value.message);
        this.dialogRef.close();
        this.loading = false;
      },
      error: (err) => {
       
        this.loading = false;
        alert(
          err.error.message ||
            'error al solicitar la recuperación de contraseña'
        );
        
      },
    });
  }
}
