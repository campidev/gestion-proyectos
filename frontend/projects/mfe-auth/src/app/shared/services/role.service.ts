import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
private apiUrl = 'https://webminube.ddns.net/campidev/auth/api/admin/roles';
  //private apiUrl = 'http://localhost:9095/auth/api/admin/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Asignar rol a usuario
  assignRole(username: string, roleId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/assign/${username}/${roleId}`, {}, { responseType: 'text' });
  }

  // 🔹 Quitar rol de usuario
  removeRole(username: string, roleId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/remove/${username}/${roleId}`, { responseType: 'text' });
  }
}
