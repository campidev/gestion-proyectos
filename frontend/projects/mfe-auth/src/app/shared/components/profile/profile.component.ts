import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';


import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { UserPasswordDialogComponent } from '../user-password-dialog/user-password-dialog.component';
import { RoleService } from '../../services/role.service';
import { RoleDialogComponent } from '../app-role-dialog/role-dialog.component';
import { firstValueFrom, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from 'shared-state';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatInputModule,   
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'name', 'lastName', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  loading = false;
 username$: Observable<string | null>;
title:string = 'Gestión de Perfil';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private roleService:RoleService,
    private store: Store
  ) {
    this.username$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadUsers();
  }
 

  loadUsers(): void {
    this.loading = true;
   this.username$.subscribe(authUsername => {
    this.userService.getUser(authUsername as string).subscribe({
      next: users => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => {
        this.showMessage('Error al cargar usuarios', true);
        this.loading = false;
      }
    });
  });
  }

  changeStatus(user: User, newStatus: string) {
    this.userService.changeUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.loadUsers();
        this.showMessage(`Estado de ${user.username} actualizado`);
      },
      error: () => this.showMessage('Error al cambiar estado', true)
    });
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: user ? { ...user } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUserName(result.id, result.firstname, result.lastname,result.email).subscribe({
          next: () => {
            this.loadUsers();
            this.showMessage('Usuario actualizado con éxito');
          },
          error: () => this.showMessage('Error al actualizar usuario', true)
        });
      }
    });
  }

  updatePassword(user: User) {
  const dialogRef = this.dialog.open(UserPasswordDialogComponent, {
    width: '400px',
    data: { userId: user.id }
  });

  dialogRef.afterClosed().subscribe(newPassword => {
    if (newPassword) {
      this.userService.updateUserPassword(user.id, newPassword).subscribe({
        next: () => this.showMessage('Contraseña actualizada con éxito'),
        error: () => this.showMessage('Error al actualizar contraseña', true),
      });
    }
  });
}

  private showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success']
    });
  }

  openRoleDialog(user: any) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result: { assigned: number[], removed: number[] } | undefined) => {
      if (result) {
        // Asignar roles seleccionados
        result.assigned.forEach(roleId => {
          this.roleService.assignRole(user.username, roleId).subscribe();
        });
        // Quitar roles seleccionados
        result.removed.forEach(roleId => {
          this.roleService.removeRole(user.username, roleId).subscribe();
        });

        // Refrescar la tabla si es necesario
        setTimeout(() => {
              this.loadUsers();
            }, 500);
      }
    });
  }
}
