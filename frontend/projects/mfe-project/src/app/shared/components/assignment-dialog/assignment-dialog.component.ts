import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Assignment } from '../../models/assignment.model';

import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { User } from '../../models/users.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
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
  templateUrl: './assignment-dialog.component.html',
  styleUrls: ['./assignment-dialog.component.css'],
})
export class AssignmentDialogComponent {
  assignmentForm: FormGroup;
  users: User[] = [];   // ✅ no undefined
  filteredUsers: User[] = [];
  userFilter: string = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<AssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Assignment | null
  ) {
    this.assignmentForm = this.fb.group({      
      userName: [data?.userName || '', Validators.required],
      role: [data?.role || 'desarrollador', Validators.required],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUsers();
  }
  save(): void {
    if (this.assignmentForm.valid) {
      this.dialogRef.close(this.assignmentForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  getUsers() {
    this.userService.getAll().subscribe({
      next: (value: User[]) => {
        this.users = value;
        this.filteredUsers = [...this.users];
      },
    });
  }

filterUsers(value: string): void {
  const filterValue = value.toLowerCase();
  this.filteredUsers = this.users.filter(user =>
    user.username.toLowerCase().includes(filterValue)
  );
}


}
