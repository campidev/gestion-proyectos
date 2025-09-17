import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { AuthRemoteService } from '../../../core/services/AuthRemotes.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from 'shared-state';
@Component({
  selector: 'app-comments',
  standalone: true,
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
    DatePipe,
    CommonModule,
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'content',
    'taskId',
    'userId',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<Comment>();
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
username$: Observable<string | null>;
  constructor(
    private commentService: CommentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private authRemote: AuthRemoteService,
    private store: Store
  ) {
    this.username$ = this.store.select(selectUser);
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { id: number };

    if (state?.id != null) {
      this.loadCommentsByTask(state.id);
    } else {
      if(this.hasRole(['ADMIN', 'PROJECT_MANAGER'])){
this.loadComments();
      }else{
        this.router.navigate(["/"]);
      }
      
    }
  }
    async isUsername(usernameToCheck: string): Promise<boolean> {
    const currentUsername = await firstValueFrom(this.username$);
    return currentUsername === usernameToCheck;
  }

  ngOnInit(): void {}

  loadComments(): void {
    this.loading = true;
    this.commentService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        this.loading = false;
        // this.snackBar.open('Error al cargar los comentarios', 'Cerrar', { duration: 3000 });
      },
    });
  }
  loadCommentsByTask(taskId: number): void {
    this.loading = true;
    this.commentService.getAllByTask(taskId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        this.loading = false;
        // this.snackBar.open('Error al cargar los comentarios', 'Cerrar', { duration: 3000 });
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(comment?: Comment): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: comment ? { ...comment } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (comment) {
          this.commentService.update(comment.commentId!, result).subscribe({
            next: () => {
              this.snackBar.open('Comentario actualizado con éxito', 'Cerrar', {
                duration: 3000,
              });
              this.loadComments();
            },
            error: () => {
              this.snackBar.open(
                '❌ Error al actualizar el comentario',
                'Cerrar',
                { duration: 3000 }
              );
            },
          });
        } else {
          this.commentService.create(result).subscribe({
            next: () => {
              this.snackBar.open('Comentario creado con éxito', 'Cerrar', {
                duration: 3000,
              });
              this.loadComments();
            },
            error: () => {
              this.snackBar.open('❌ Error al crear el comentario', 'Cerrar', {
                duration: 3000,
              });
            },
          });
        }
      }
    });
  }

  deleteComment(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este comentario?')) {
      this.commentService.delete(id).subscribe(() => {
        this.snackBar.open('Comentario eliminado', 'Cerrar', {
          duration: 3000,
        });
        this.loadComments();
      });
    }
  }

   hasRole(roles: string[]): boolean {
    return this.authRemote.hasRole(roles);
  }
}
