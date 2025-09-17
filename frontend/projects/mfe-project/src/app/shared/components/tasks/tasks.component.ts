import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Router } from '@angular/router';

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
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { CommentService } from '../../services/comment.service';
import { MatNativeDateModule } from '@angular/material/core';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';
import { AuthRemoteService } from '../../../core/services/AuthRemotes.service';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
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
    CommonModule,
    MatNativeDateModule,
  ],
  providers: [
    MatNativeDateModule, // 👈 añadirlo aquí
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'priority',
    'dueDate',
    'projectId',
    'sprintId',
    'actions',
  ];
  dataSource = new MatTableDataSource<Task>();
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private commentService: CommentService,
    private assignmentService: AssignmentService,
    private authRemote: AuthRemoteService,
    private router: Router
  ) {
    
    
  }

  ngOnInit(): void {
    if(this.hasRole(['ADMIN', 'PROJECT_MANAGER'])){
  this.loadTasks();
    }else{
      this.loadTasksByUser()
    }
  
  }


  loadTasks(): void {
    this.loading = true;
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tareas:', err);
        this.loading = false;
        // this.snackBar.open('Error al cargar las tareas', 'Cerrar', { duration: 3000 });
      },
    });
  }
  loadTasksByUser(): void {
    this.loading = true;
    this.taskService.getAllByUser().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tareas:', err);
        this.loading = false;
        // this.snackBar.open('Error al cargar las tareas', 'Cerrar', { duration: 3000 });
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task ? { ...task } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (task) {
          this.taskService.update(task.taskId!, result).subscribe(() => {
            this.snackBar.open('Tarea actualizada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.loadTasks();
          });
        } else {
          this.taskService.create(result).subscribe(() => {
            this.snackBar.open('Tarea creada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.loadTasks();
          });
        }
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
      this.taskService.delete(id).subscribe(() => {
        this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 3000 });
        this.loadTasks();
      });
    }
  }

  openCommentDialog(taskId: number): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.taskId = taskId;
        this.commentService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Comentario creado con éxito', 'Cerrar', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('❌ Error al crear el comentario', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
  openTaskDialog(taskId: number): void {
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.taskId = taskId;
        this.assignmentService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Asignación creada con éxito', 'Cerrar', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('❌ Error al crear la Asignación', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
  hasRole(roles: string[]): boolean {
    return this.authRemote.hasRole(roles);
  }
  goToComments(id:number) {    
  this.router.navigate(['dashboard/projects/comentarios'], { state: {id:id} });
}
}
