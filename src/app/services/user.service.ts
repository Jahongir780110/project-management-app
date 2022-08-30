import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/authUser.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseUrl;
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YjFmNTE0Yy1hMjk5LTQwM2QtOWQ4MC1jZDViYjhmNTg1YzIiLCJsb2dpbiI6ImNvbm9yOTkiLCJpYXQiOjE2NjE3NjQ2OTJ9.dSXBIEXZ_DBg5vOuWdjPY9_TYEuu8VWJYuqwZFAIDi0';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }),
  };
  users: User[] = [];

  constructor(private http: HttpClient) {}

  get isAuthenticated() {
    return this.token ? true : false;
  }

  createUser(authUser: AuthUser) {
    return this.http.post<User>(
      `${this.baseUrl}/signup`,
      authUser,
      this.httpOptions
    );
  }

  signIn(authUser: AuthUser) {
    return this.http
      .post<{ token: string }>(
        `${this.baseUrl}/signin`,
        authUser,
        this.httpOptions
      )
      .pipe(
        tap((user) => {
          this.token = user.token;
        })
      );
  }

  getAllUsers() {
    return this.http
      .get<User[]>(`${this.baseUrl}/users`, this.httpOptions)
      .pipe(
        tap((users) => {
          this.users = users;
        })
      );
  }
}
