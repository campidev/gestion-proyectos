import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sprint } from '../../models/sprint.model';
import { SprintService } from '../../services/sprint.service';
import { SprintDialogComponent } from '../sprint-dialog/sprint-dialog.component';


import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-sprints',
  standalone:true,
    imports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DatePipe,
    MatOptionModule,
    CommonModule,
    MatNativeDateModule
  ],providers: [
      MatNativeDateModule  // 👈 añadirlo aquí
    ],
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'dates', 'projectId', 'actions'];
  dataSource = new MatTableDataSource<Sprint>();
loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sprintService: SprintService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadSprints();
  }

  loadSprints(): void {
  this.loading = true;
  this.sprintService.getAll().subscribe({
    next: (data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar sprints:', err);
      this.loading = false;
      // Aquí puedes usar un snackbar de Angular Material
      // this.snackBar.open('Error al cargar los sprints', 'Cerrar', { duration: 3000 });
    }
  });
}


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(sprint?: Sprint): void {
    const dialogRef = this.dialog.open(SprintDialogComponent, {
      width: '400px',
      data: sprint ? { ...sprint } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (sprint) {
          this.sprintService.update(sprint.sprintId!, result).subscribe(() => {
            this.snackBar.open('Sprint actualizado con éxito', 'Cerrar', { duration: 3000 });
            this.loadSprints();
          });
        } else {
          this.sprintService.create(result).subscribe(() => {
            this.snackBar.open('Sprint creado con éxito', 'Cerrar', { duration: 3000 });
            this.loadSprints();
          });
        }
      }
    });
  }

  deleteSprint(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este sprint?')) {
      this.sprintService.delete(id).subscribe({next :() => {
        this.snackBar.open('Sprint eliminado', 'Cerrar', { duration: 3000 });
        this.loadSprints();
      },error: (err) => {this.snackBar.open('Error al eliminar sprint: '
          +err.error.message, 'Cerrar', { duration: 3000 })}});
    }
  }

    openTaskDialog(projectId: number,sprintId:number): void {
      const dialogRef = this.dialog.open(TaskDialogComponent, {
        width: '500px',
        data: null
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {    
          result.projectId = projectId;
          result.sprintId =sprintId;
            this.taskService.create(result).subscribe(() => {
              this.snackBar.open('Tarea creada con éxito', 'Cerrar', { duration: 3000 });
              
            });
          
        }
      });
    }
}
