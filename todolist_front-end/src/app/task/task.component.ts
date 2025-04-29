import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService, Task } from '../task.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  providers: [TaskService]
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  nextId = 1; // Pour gérer les IDs localement

  // Le FormGroup est un conteneur qui regroupe plusieurs contrôles de formulaire
  taskForm: FormGroup;
  editTaskform: FormGroup;
  editingTask: Task | null = null;

  // Le FormBuilder est un service qui simplifie la création de formulaires complexes
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    // c'est plus complexe mais court et robuste. Sa évite de faire une méthode pour valider l'url.
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    // l'espace avant le Validators indique la valeur initial qui est vide
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      imageURL: ['', [Validators.required, Validators.pattern(urlRegex)]]
    });

    this.editTaskform = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      imageURL: ['', [Validators.required, Validators.pattern(urlRegex)]]
    });
  }

  ngOnInit(): void {
    // Charger les tâches depuis l'API
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (apiTasks) => {
        // Si l'API retourne des tâches avec juste id et title (selon le format du backend)
        // On les convertit au format attendu par le frontend
        this.tasks = apiTasks.map(task => {
          return {
            ...task,
            valid: task.valid || '❌',
            taskButtonText: task.taskButtonText || 'Tâche non finit !',
            userHasPressed: task.userHasPressed || false,
            ButtonDelete: task.ButtonDelete || 'Supprimer la tâche',
            createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
          };
        });
        
        // Déterminer le prochain ID à utiliser
        if (this.tasks.length > 0) {
          const maxId = Math.max(...this.tasks.map(t => t.id));
          this.nextId = maxId + 1;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tâches', err);
      }
    });
  }


  onTask(task: Task): void {
    if (task.userHasPressed) {
      this.unTask(task);
    } else {
      this.task(task);
    }

    // Mettre à jour la tâche dans l'API
    this.taskService.updateTask(task).subscribe({
      error: (err) => console.error('Erreur lors de la mise à jour de la tâche', err)
    });
  }

  unTask(task: Task) {
    task.valid = '❌';
    task.taskButtonText = 'Tâche non finit !';
    task.userHasPressed = false;
  }

  task(task: Task) {
    task.valid = '✅';
    task.taskButtonText = 'Tâche finit !';
    task.userHasPressed = true;
  }

  // les getters vont être utilisé pour le html,
  // au lieu d'utiliser "taskForm.get('title')" on utilisera "titleControl"
  get titleControl() { return this.taskForm.get('title'); }
  get descriptionControl() { return this.taskForm.get('description'); }
  get imageURLControl() { return this.taskForm.get('imageURL'); }

  addTask() {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;
      
      const newTask: Task = {
        id: this.nextId++,
        title: formValues.title,
        description: formValues.description,
        createdAt: new Date(),
        valid: '❌',
        imageURL: formValues.imageURL,
        taskButtonText: 'Tâche non finit !',
        userHasPressed: false,
        ButtonDelete: 'Supprimer la tâche'
      };
      
      // Ajouter la tâche via l'API
      this.taskService.addTask(newTask).subscribe({
        next: () => {
          // Succès: ajout local et réinitialisation du formulaire
          this.tasks.unshift(newTask);
          this.taskForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de la tâche', err);
          // Erreur: ajout local quand même et log de l'erreur
          this.tasks.unshift(newTask);
          this.taskForm.reset();
        }
      });
    }
  }

  updateTask(tasktoUpdate: Task) {
    if (!tasktoUpdate.id) {
      console.error('Impossible de modifier une tâche sans ID');
      return;
    }

    this.taskService.updateTask(tasktoUpdate).subscribe({
      next: () => {

      }
    })
  }

  deleteTask(taskToDelete: Task) {
    if (!taskToDelete.id) {
      console.error('Impossible de supprimer une tâche sans ID');
      return;
    }
    
    this.taskService.deleteTask(taskToDelete.id).subscribe({
      next: () => {
        // Supprimer de l'affichage local
        const index = this.tasks.findIndex(task => task === taskToDelete);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la tâche', err);
        // Supprimer quand même en local en cas d'erreur
        const index = this.tasks.findIndex(task => task === taskToDelete);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
      }
    });
  }
}