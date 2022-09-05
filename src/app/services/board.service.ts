import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  baseUrl = environment.baseUrl;
  boards: Board[] = [];
  selectedBoard!: Board;

  constructor(private http: HttpClient, private userService: UserService) {}

  get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.userService.token}`,
      }),
    };
  }

  getAllBoards() {
    return this.http
      .get<Board[]>(`${this.baseUrl}/boards`, this.httpOptions)
      .pipe(
        tap((boards) => {
          this.boards = boards;
        })
      );
  }

  getBoard(id: string) {
    return this.http
      .get<Board>(`${this.baseUrl}/boards/${id}`, this.httpOptions)
      .pipe(
        tap((board) => {
          console.log('board', board);

          this.selectedBoard = board;

          this.selectedBoard.columns?.sort((a, b) =>
            a.order < b.order ? -1 : 1
          );
        })
      );
  }

  createBoard(title: string, description: string) {
    return this.http
      .post<Board>(
        `${this.baseUrl}/boards`,
        {
          title,
          description,
        },
        this.httpOptions
      )
      .pipe(
        tap((board) => {
          this.boards.push(board);
        })
      );
  }

  deleteBoard(id: string) {
    return this.http
      .delete(`${this.baseUrl}/boards/${id}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.token}`,
        }),
      })
      .pipe(
        tap(() => {
          const boardIndex = this.boards.findIndex((board) => board.id === id);
          this.boards.splice(boardIndex, 1);
        })
      );
  }

  addColumn(title: string) {
    return this.http
      .post<Column>(
        `${this.baseUrl}/boards/${this.selectedBoard.id}/columns`,
        {
          title,
        },
        this.httpOptions
      )
      .pipe(
        tap((column) => {
          this.selectedBoard.columns?.push({ ...column, tasks: [] });
        })
      );
  }

  editColumn(columnId: string, order: number, title: string) {
    return this.http
      .put<Column>(
        `${this.baseUrl}/boards/${this.selectedBoard.id}/columns/${columnId}`,
        {
          title,
          order,
        },
        this.httpOptions
      )
      .pipe(
        tap(() => {
          const column = this.selectedBoard.columns?.find(
            (col) => col.id === columnId
          );
          if (column) {
            column.title = title;
          }
        })
      );
  }

  deleteColumn(columnId: string) {
    return this.http
      .delete(
        `${this.baseUrl}/boards/${this.selectedBoard.id}/columns/${columnId}`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.userService.token}`,
          }),
        }
      )
      .pipe(
        tap(() => {
          const columnIndex = this.selectedBoard.columns?.findIndex(
            (col) => col.id === columnId
          );
          if (columnIndex !== undefined) {
            this.selectedBoard.columns?.splice(columnIndex, 1);
          }
        })
      );
  }

  addTask(
    title: string,
    description: string,
    userId: string,
    columnId: string
  ) {
    return this.http
      .post<Task>(
        `${this.baseUrl}/boards/${this.selectedBoard.id}/columns/${columnId}/tasks`,
        {
          title,
          description,
          userId,
        },
        this.httpOptions
      )
      .pipe(
        tap((task) => {
          const column = this.selectedBoard.columns?.find(
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
        `${this.baseUrl}/boards/${this.selectedBoard.id}/columns/${columnId}/tasks/${taskId}`,
        {
          title: editedTask.title,
          order: editedTask.order,
          description: editedTask.description,
          userId: editedTask.userId,
          boardId: this.selectedBoard.id,
          columnId: editedTask.columnId,
        },
        this.httpOptions
      )
      .pipe(
        tap((res) => {
          if (isChangingOrder) return;

          const column = this.selectedBoard.columns?.find(
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
        `${this.baseUrl}/boards/${this.selectedBoard.id}/columns/${columnId}/tasks/${taskId}`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.userService.token}`,
          }),
        }
      )
      .pipe(
        tap(() => {
          const column = this.selectedBoard.columns?.find(
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
