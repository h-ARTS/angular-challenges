import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private ENDPOINT = 'https://jsonplaceholder.typicode.com/todos';
  private http = inject(HttpClient);

  #todos = signal<Todo[]>([]);
  todos = this.#todos.asReadonly();

  constructor() {
    this.fetchTodos();
  }

  private fetchTodos() {
    this.http.get<Todo[]>(this.ENDPOINT).subscribe((todos) => {
      this.#todos.set(todos);
    });
  }

  updateTodo(todo: Todo) {
    this.http
      .put<any>(
        `${this.ENDPOINT}/${todo.id}`,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          body: todo.body,
          userId: todo.userId,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
      .subscribe((todoUpdated: Todo) => {
        this.#todos.update((arr) => {
          const index = arr.findIndex((t) => t.id === todoUpdated.id);
          if (index !== -1) arr[index] = todoUpdated;
          return arr;
        });
      });
  }
}
