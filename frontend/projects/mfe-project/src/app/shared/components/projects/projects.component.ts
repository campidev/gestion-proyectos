import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { CommonModule } from '@angular/common';
import { MatCard } from "@angular/material/card";
@Component({
  selector: 'app-projects',
  standalone:true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,    
],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  displayedColumns: string[] = ['projectId', 'name', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource<Project>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.dataSource.data = projects;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(project?: Project) {
   
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: project ? { ...project } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.projectId) {
          this.projectService.updateProject(result.projectId, result).subscribe({
            next: () => {
              this.loadProjects();
              this.showMessage('Proyecto actualizado con éxito');
            },
            error: () => this.showMessage('Error al actualizar proyecto', true)
          });
        } else {
           result.createdBy = 24;
          this.projectService.createProject(result).subscribe({
            next: () => {
              this.loadProjects();
              this.showMessage('Proyecto creado con éxito');
            },
            error: (err) => {this.showMessage('Error al crear proyecto', true); console.log(err);}
          });
        }
      }
    });
  }

  deleteProject(id: number) {
    if (confirm('¿Seguro que deseas eliminar este proyecto?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
          this.snackBar.open('Proyecto eliminado', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {this.snackBar.open('Error al eliminar proyecto: '
          +err.error.message, 'Cerrar', { duration: 3000 })}
      });
    }
}
 private showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success']
    });
  }


}
