import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Todo } from './models/todo.model';
import { ErrorsService } from './services/errors.service';
import { LoadingService } from './services/loading.service';
import { TodoService } from './services/todo.service';

@Component({
  imports: [MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    @if (error()) {
      <div class="error-message">
        {{ error() }}
      </div>
    }

    @if (loading()) {
      <div class="loading-indicator">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
    }

    @for (todo of todos(); track todo.id) {
      {{ todo.title }}
      <button (click)="update(todo)">Update</button>
      <button (click)="delete(todo.id)">Delete</button>
    }
  `,
})
export class AppComponent {
  private todoService = inject(TodoService);
  protected errorsService = inject(ErrorsService);
  protected loadingService = inject(LoadingService);
  todos = this.todoService.todos;
  error = this.errorsService.error;
  loading = this.loadingService.loading;

  update(todo: Todo) {
    this.todoService.updateTodo(todo);
  }

  delete(id: number) {
    this.todoService.deleteTodo(id);
  }
}
