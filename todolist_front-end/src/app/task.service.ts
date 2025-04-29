import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  createdAt?: Date;
  valid?: string;
  imageURL?: string;
  taskButtonText?: string;
  userHasPressed?: boolean;
  ButtonDelete?: string;
}
//permet d'injecter ce service à la racine de l'application
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) { }

  // GET : récupérer toutes les tâches
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // POST : ajouter une nouvelle tâche
  addTask(task: Task): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  // PUT : modifier une tâche
  updateTask(task: Task): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${task.id}`, task);
  }

  // DELETE : supprimer une tâche
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}