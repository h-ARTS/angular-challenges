import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  #loading = signal(false);
  loading = this.#loading.asReadonly();

  setLoading(isLoading: boolean) {
    this.#loading.set(isLoading);
  }
}
