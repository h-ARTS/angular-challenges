import { Base } from './base.model';

export interface Todo extends Base {
  completed: boolean;
  title: string;
  body: string;
  userId: number;
}
