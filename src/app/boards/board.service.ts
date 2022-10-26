import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserService } from '../user/user.service';

import { Board } from '../models/board.model';

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
}
