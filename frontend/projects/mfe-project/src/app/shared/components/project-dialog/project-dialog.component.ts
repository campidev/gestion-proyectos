import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../models/project.model';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-project-dialog',
  standalone:true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule
],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css']
})
export class ProjectDialogComponent {

  project: Project;

  constructor(
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project | null
  ) {
    this.project = data ? { ...data } : { name: '', description: '', status: 'EN_PROGRESO' };
  }

  onSave(): void {
    this.dialogRef.close(this.project);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
