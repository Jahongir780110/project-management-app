import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserService } from '../user/user.service';

import { BoardService } from './board.service';
import { Column } from '../models/column.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private boardService: BoardService
  ) {}

  get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.userService.token}`,
      }),
    };
  }

  addTask(
    title: string,
    description: string,
    userId: string,
    columnId: string
  ) {
    return this.http
      .post<Task>(
        `${this.baseUrl}/boards/${this.boardService.selectedBoard.id}/columns/${columnId}/tasks`,
        {
          title,
          description,
          userId,
        },
        this.httpOptions
      )
      .pipe(
        tap((task) => {
          const column = this.boardService.selectedBoard.columns?.find(
            (col) => col.id === columnId
          );

          if (column) {
            column.tasks?.push(task);
          }
        })
      );
  }

  editTask(
    columnId: string,
    taskId: string,
    editedTask: Task,
    isChangingOrder?: boolean
  ) {
    return this.http
      .put<Task>(
        `${this.baseUrl}/boards/${this.boardService.selectedBoard.id}/columns/${columnId}/tasks/${taskId}`,
        {
          title: editedTask.title,
          order: editedTask.order,
          description: editedTask.description,
          userId: editedTask.userId,
          boardId: this.boardService.selectedBoard.id,
          columnId: editedTask.columnId,
        },
        this.httpOptions
      )
      .pipe(
        tap((res) => {
          if (isChangingOrder) return;

          const column = this.boardService.selectedBoard.columns?.find(
            (col) => col.id === columnId
          ) as Column;

          let taskIndex = column.tasks?.findIndex((t) => t.id === taskId);

          if (taskIndex !== undefined) {
            column.tasks?.splice(taskIndex, 1, res);
          }
        })
      );
  }

  deleteTask(columnId: string, taskId: string) {
    return this.http
      .delete(
        `${this.baseUrl}/boards/${this.boardService.selectedBoard.id}/columns/${columnId}/tasks/${taskId}`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.userService.token}`,
          }),
        }
      )
      .pipe(
        tap(() => {
          const column = this.boardService.selectedBoard.columns?.find(
            (col) => col.id === columnId
          ) as Column;

          const taskIndex = column.tasks?.findIndex(
            (t) => t.id === taskId
          ) as number;

          if (taskId !== undefined) {
            column.tasks?.splice(taskIndex, 1);
          }
        })
      );
  }
}
