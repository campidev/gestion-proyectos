import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Sprint } from '../../models/sprint.model';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sprint-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  providers: [
    MatNativeDateModule, // 👈 añadirlo aquí
  ],

  templateUrl: './sprint-dialog.component.html',
  styleUrls: ['./sprint-dialog.component.css'],
})
export class SprintDialogComponent {
  sprintForm: FormGroup;
  projects!: Project[];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SprintDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: Sprint | null
  ) {
    this.sprintForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      startDate: [data?.startDate || '', Validators.required],
      endDate: [data?.endDate || '', Validators.required],
      projectId: [data?.projectId || '', Validators.required],
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
      },
    });
  }

  save(): void {
    if (this.sprintForm.valid) {
      this.dialogRef.close(this.sprintForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
