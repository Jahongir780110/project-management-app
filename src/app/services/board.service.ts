import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  baseUrl = environment.baseUrl;
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YjFmNTE0Yy1hMjk5LTQwM2QtOWQ4MC1jZDViYjhmNTg1YzIiLCJsb2dpbiI6ImNvbm9yOTkiLCJpYXQiOjE2NjE3NjQ2OTJ9.dSXBIEXZ_DBg5vOuWdjPY9_TYEuu8VWJYuqwZFAIDi0';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }),
  };
  boards: Board[] = [];
  selectedBoard!: Board;

  constructor(private http: HttpClient) {}

  getAllBoards() {
    return this.http
      .get<Board[]>(`${this.baseUrl}/boards`, this.httpOptions)
      .pipe(
        tap((boards) => {
          console.log('boards', boards);

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
          Authorization: `Bearer ${this.token}`,
        }),
      })
      .pipe(
        tap(() => {
          const targetId = this.boards.findIndex((board) => board.id === id);
          this.boards.splice(targetId, 1);
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
        tap((board) => {
          console.log('board again', board);
          this.selectedBoard.columns?.push(board);
        })
      );
  }

  deleteColumn(columnId: string) {
    return this.http
      .delete(
        `${this.baseUrl}/boards/${this.selectedBoard.id}/columns/${columnId}`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
          }),
        }
      )
      .pipe(
        tap(() => {
          const targetId = this.selectedBoard.columns?.findIndex(
            (col) => col.id === columnId
          );
          if (targetId !== undefined) {
            this.selectedBoard.columns?.splice(targetId, 1);
          }
        })
      );
  }
}
