import { Component, inject } from '@angular/core';
import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';

@Component({
  imports: [],
  selector: 'app-root',
  template: `
    @for (todo of todos(); track todo.id) {
      {{ todo.title }}
      <button (click)="update(todo)">Update</button>
    }
  `,
  styles: [],
})
export class AppComponent {
  private todoService = inject(TodoService);
  todos = this.todoService.todos;

  update(todo: Todo) {
    this.todoService.updateTodo(todo);
  }
}
