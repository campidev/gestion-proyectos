import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sprint } from '../models/sprint.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  //private apiUrl = 'http://localhost:9095/projects/api/sprints';
  private apiUrl = 'https://webminube.ddns.net/campidev/projects/api/sprints';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.apiUrl);
  }

  create(sprint: Sprint): Observable<Sprint> {
    return this.http.post<Sprint>(this.apiUrl, sprint);
  }

  update(id: number, sprint: Sprint): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.apiUrl}/${id}`, sprint);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
