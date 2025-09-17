import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  standalone: true,
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
  ]
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'roleName', 'description', 'actions'];
  dataSource = new MatTableDataSource<Role>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.dataSource.data = roles;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => {
        this.showMessage('Error al cargar roles', true);
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

  openDialog(role?: Role) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '400px',
      data: role ? { ...role } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.roleService.updateRole(result.id, result).subscribe({
            next: () => {
              this.loadRoles();
              this.showMessage('Rol actualizado con éxito');
            },
            error: () => this.showMessage('Error al actualizar rol', true)
          });
        } else {
          this.roleService.createRole(result).subscribe({
            next: () => {
              this.loadRoles();
              this.showMessage('Rol creado con éxito');
            },
            error: () => this.showMessage('Error al crear rol', true)
          });
        }
      }
    });
  }

  deleteRole(id: number) {
    if (confirm('¿Seguro que deseas eliminar este rol?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.loadRoles();
          this.showMessage('Rol eliminado correctamente');
        },
        error: () => this.showMessage('Error al eliminar rol', true)
      });
    }
  }

  private showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success']
    });
  }
}
