import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';
@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectionList,
    MatListOption,
  ],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.css'],
})
export class RoleDialogComponent {
  allRoles: Role[] = [];

  constructor(
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.allRoles = roles;
      },
      error: () => {},
    });
  }
  save(selectedOptions: { value: number }[]) {
    // Extraemos los IDs seleccionados en el diálogo
    const selectedIds: number[] = selectedOptions.map((o) => o.value);

    // Roles a asignar: seleccionados que no estaban previamente en el usuario
    const assigned: number[] = selectedIds.filter(
      (id) =>
        !this.data.user.roles.includes(
          this.allRoles.find((r) => r.id === id)?.roleName as string
        )
    );

    // Roles a quitar: los que estaban antes y no están seleccionados
    const removed: number[] = this.data.user.roles
      .map((r: string) => this.allRoles.find((role) => role.roleName === r)?.id) // r es string
      .filter(
        (id: number | undefined): id is number =>
          id !== undefined && !selectedIds.includes(id)
      );

    // Cerramos el diálogo pasando los cambios
    this.dialogRef.close({ assigned, removed });
  }
}
