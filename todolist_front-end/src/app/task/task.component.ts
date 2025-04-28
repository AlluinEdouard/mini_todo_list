import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  tasks: {
    title: string;
    description: string;
    createdAt: Date;
    valid: string;
    imageURL: string;
    taskButtonText: string;
    userHasPressed: boolean;
    ButtonDelete: string;
  }[] = [];

  // Le FormGroup est un conteneur qui regroupe plusieurs contrôles de formulaire
  taskForm: FormGroup;

  // Le FormBuilder est un service qui simplifie la création de formulaires complexes
  constructor(private fb: FormBuilder) {
    // c'est plus complexe mais court et robuste. Sa évite de faire une méthode pour valider l'url.
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    // l'espace avant le Validators indique la valeur initial qui est vide
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      imageURL: ['', [Validators.required, Validators.pattern(urlRegex)]]
    });
  }

  ngOnInit(): void {
    this.tasks = [
      {
        title: 'Aspirer et laver la maison',
        description: 'Il faudra acheter les produits chez Auchan',
        createdAt: new Date(),
        valid: '❌',
        imageURL: 'https://www.bissell.fr/media/mageplaza/blog/post/f/1/f1529259436c3d37ec5535d22343c097_1.jpg',
        taskButtonText: 'Tâche non finit !',
        userHasPressed: false,
        ButtonDelete: 'Supprimer la tâche'
      },
      {
        title: 'Faire les devoirs Angular',
        description: 'Finir le projet de mini To-Do list',
        createdAt: new Date(),
        valid: '❌',
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png',
        taskButtonText: 'Tâche non finit !',
        userHasPressed: false,
        ButtonDelete: 'Supprimer la tâche'
      },
      {
        title: 'Préparer le repas',
        description: 'Sortir les ingrédients et cuisiner un bon plat',
        createdAt: new Date(),
        valid: '❌',
        imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj17gMlP7ASNtgihPWL0xCrzdFskP6UErbWQ&s',
        taskButtonText: 'Tâche non finit !',
        userHasPressed: false,
        ButtonDelete: 'Supprimer la tâche'
      }
    ];
  }

  onTask(task: any): void {
    if (task.userHasPressed) {
      this.unTask(task);
    } else {
      this.task(task);
    }
  }

  unTask(task: any) {
    task.valid = '❌';
    task.taskButtonText = 'Tâche non finit !';
    task.userHasPressed = false;
  }

  task(task: any) {
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
      
      this.tasks.unshift({ // le unshift ajoute un élément au début du tableau
        title: formValues.title,
        description: formValues.description,
        createdAt: new Date(),
        valid: '❌',
        imageURL: formValues.imageURL,
        taskButtonText: 'Tâche non finit !',
        userHasPressed: false,
        ButtonDelete: 'Supprimer la tâche'
      });
      
      this.taskForm.reset();
    }
  }

  deleteTask(ButtonDelete: any) {
    const index = this.tasks.findIndex(task => task === ButtonDelete);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
}
