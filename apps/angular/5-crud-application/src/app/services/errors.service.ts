import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorsService {
  #error = signal<string | null>(null);
  error = this.#error.asReadonly();

  handleHttpError(errCandidate: HttpErrorResponse) {
    let errorMessage: string;

    if (errCandidate.error instanceof ErrorEvent) {
      errorMessage = `Error: ${errCandidate.error.message}`;
    } else {
      errorMessage = `Error Code: ${errCandidate.status}\nMessage: ${errCandidate.message}`;
    }

    this.#error.set(errorMessage);
    console.error(errorMessage);

    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  clearError() {
    this.#error.set(null);
  }
}
