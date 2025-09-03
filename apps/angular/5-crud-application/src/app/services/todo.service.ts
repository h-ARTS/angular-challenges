import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { randText } from '@ngneat/falso';
import { catchError, tap, throwError } from 'rxjs';
import { Todo } from '../models/todo.model';
import { ErrorsService } from './errors.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private ENDPOINT = 'https://jsonplaceholder.typicode.com/todos';
  private http = inject(HttpClient);
  private errorService = inject(ErrorsService);
  private loadingService = inject(LoadingService);

  #todos = signal<Todo[]>([]);
  todos = this.#todos.asReadonly();

  constructor() {
    this.fetchTodos();
  }

  private fetchTodos() {
    this.loadingService.setLoading(true);
    this.http
      .get<Todo[]>(this.ENDPOINT)
      .pipe(
        tap(() => this.loadingService.setLoading(false)),
        catchError((err) => {
          this.errorService.handleHttpError(err);
          return throwError(() => err);
        }),
      )
      .subscribe((todos) => {
        this.#todos.set(todos);
        this.loadingService.setLoading(false);
      });
  }

  updateTodo(todo: Todo) {
    this.loadingService.setLoading(true);
    this.http
      .put<Todo>(
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
      .pipe(
        tap(() => this.loadingService.setLoading(false)),
        catchError((err) => {
          this.errorService.handleHttpError(err);
          return throwError(() => err);
        }),
      )
      .subscribe((todoUpdated: Todo) => {
        this.#todos.update((arr) => {
          const index = arr.findIndex((t) => t.id === todoUpdated.id);
          if (index !== -1) arr[index] = todoUpdated;
          return arr;
        });
        this.loadingService.setLoading(false);
      });
  }

  deleteTodo(id: number) {
    this.loadingService.setLoading(true);
    this.http
      .delete<void>(`${this.ENDPOINT}/${id}`, {
        headers: {
          'Content-type': 'application/json; charset=UTF=8',
        },
      })
      .pipe(
        tap(() => this.loadingService.setLoading(false)),
        catchError((err) => {
          this.errorService.handleHttpError(err);
          return throwError(() => err);
        }),
      )
      .subscribe(() => {
        this.#todos.update((arr) => arr.filter((t) => t.id !== id));
        this.loadingService.setLoading(false);
      });
  }
}
