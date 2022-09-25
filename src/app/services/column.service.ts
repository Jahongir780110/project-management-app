import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

import { BoardService } from './board.service';
import { Column } from '../models/column.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
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

  addColumn(title: string) {
    return this.http
      .post<Column>(
        `${this.baseUrl}/boards/${this.boardService.selectedBoard.id}/columns`,
        {
          title,
        },
        this.httpOptions
      )
      .pipe(
        tap((column) => {
          this.boardService.selectedBoard.columns?.push({
            ...column,
            tasks: [],
          });
        })
      );
  }

  editColumn(columnId: string, order: number, title: string) {
    return this.http
      .put<Column>(
        `${this.baseUrl}/boards/${this.boardService.selectedBoard.id}/columns/${columnId}`,
        {
          title,
          order,
        },
        this.httpOptions
      )
      .pipe(
        tap(() => {
          const column = this.boardService.selectedBoard.columns?.find(
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
        `${this.baseUrl}/boards/${this.boardService.selectedBoard.id}/columns/${columnId}`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.userService.token}`,
          }),
        }
      )
      .pipe(
        tap(() => {
          const columnIndex =
            this.boardService.selectedBoard.columns?.findIndex(
              (col) => col.id === columnId
            );
          if (columnIndex !== undefined) {
            this.boardService.selectedBoard.columns?.splice(columnIndex, 1);
          }
        })
      );
  }
}
