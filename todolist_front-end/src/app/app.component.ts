import { Component, OnInit } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [
    TaskComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
