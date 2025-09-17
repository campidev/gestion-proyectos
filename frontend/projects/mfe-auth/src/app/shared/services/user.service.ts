import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //private apiUrl = 'http://localhost:9095/auth/api/users';
  private apiUrl = 'https://webminube.ddns.net/campidev/auth/api/users';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios con sus roles
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/with-roles`);
  }
  
  getUser(username:string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/with-roles/user/${username}`);
  }

  // Cambiar estado de usuario
  changeUserStatus(id: number, newStatus: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}/status?status=${newStatus}`,
      {}
    );
  }

  // Actualizar nombre y apellido
  updateUserName(
    id: number,
    firstname: string,
    lastname: string,
    email: string
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}/name`,
      {},
      {
        params: {
          firstname,
          lastname,
          email,
        },
      }
    );
  }

  // Cambiar contraseña
 updateUserPassword(id: number, password: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}/password`,  password );
}
}
