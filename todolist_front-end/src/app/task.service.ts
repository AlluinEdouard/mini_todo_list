import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  description: string;
  imageURL?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Propriétés spécifiques à l'interface utilisateur
  valid?: string;
  taskButtonText?: string;
  userHasPressed?: boolean;
  ButtonDelete?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les tâches
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Ajouter une nouvelle tâche
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Mettre à jour une tâche
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  // Supprimer une tâche
  deleteTask(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour transformer les données du backend vers le format du frontend
  transformTaskResponse(task: any): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      imageURL: task.imageURL || 'https://via.placeholder.com/150',
      createdAt: task.createdAt,
      completed: task.completed || false,
      valid: task.completed ? '✅' : '❌',
      taskButtonText: task.completed ? 'Tâche finit !' : 'Tâche non finit !',
      userHasPressed: task.completed || false,
      ButtonDelete: 'Supprimer la tâche'
    };
  }
}