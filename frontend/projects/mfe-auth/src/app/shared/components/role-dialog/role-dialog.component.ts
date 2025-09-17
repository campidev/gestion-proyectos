import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../../models/role.model';

import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.css'],
  standalone: true
})
export class RoleDialogComponent {
  role: Role;

  constructor(
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role | null
  ) {
    this.role = data ? { ...data } : { roleName: '', description: '' };
  }

  onSave(): void {
    this.dialogRef.close(this.role);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
