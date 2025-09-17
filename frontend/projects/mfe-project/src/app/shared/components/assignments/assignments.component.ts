import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../../services/assignment.service';



import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-assignments',
  standalone:true,
  imports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    CommonModule
  ],
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'taskId', 'userId', 'role', 'assignedAt', 'actions'];
  dataSource = new MatTableDataSource<Assignment>();
loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private assignmentService: AssignmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
  this.loading = true;
  this.assignmentService.getAll().subscribe({
    next: (data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar asignaciones:', err);
      this.loading = false;
      // this.snackBar.open('Error al cargar asignaciones', 'Cerrar', { duration: 3000 });
    }
  });
}


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(assignment?: Assignment): void {
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '400px',
      data: assignment ? { ...assignment } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (assignment) {
          this.assignmentService.update(assignment.assignmentId!, result).subscribe(() => {
            this.snackBar.open('Asignación actualizada con éxito', 'Cerrar', { duration: 3000 });
            this.loadAssignments();
          });
        } else {
          this.assignmentService.create(result).subscribe(() => {
            this.snackBar.open('Asignación creada con éxito', 'Cerrar', { duration: 3000 });
            this.loadAssignments();
          });
        }
      }
    });
  }

  deleteAssignment(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta asignación?')) {
      this.assignmentService.delete(id).subscribe(() => {
        this.snackBar.open('Asignación eliminada', 'Cerrar', { duration: 3000 });
        this.loadAssignments();
      });
    }
  }
}
