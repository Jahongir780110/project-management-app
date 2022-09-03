import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { of } from 'rxjs';
import { tap, catchError, mergeMap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/authUser.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseUrl;
  token = '';
  user!: User;
  users: User[] = [];

  constructor(private http: HttpClient) {}

  get isAuthenticated() {
    return this.token ? true : false;
  }

  get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }

  createUser(authUser: AuthUser) {
    return this.http
      .post<User>(`${this.baseUrl}/signup`, authUser, this.httpOptions)
      .pipe(
        tap((user) => {
          this.user = user;
        }),
        catchError((error: HttpErrorResponse) => {
          return of(error);
        })
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
        tap((res) => {
          this.token = res.token;
          localStorage.setItem('token', this.token);
          const tokenInfo = this.getDecodedAccessToken(this.token);

          this.http
            .get<User>(
              `${this.baseUrl}/users/${tokenInfo.userId}`,
              this.httpOptions
            )
            .subscribe((user) => {
              this.user = user;
              localStorage.setItem('user', JSON.stringify(this.user));
            });
        }),
        catchError((error: HttpErrorResponse) => {
          return of(error);
        })
      );
  }

  editProfile(user: AuthUser) {
    return this.http
      .put<User>(
        `${this.baseUrl}/users/${this.user.id}`,
        user,
        this.httpOptions
      )
      .pipe(
        tap((user) => {
          this.user = user;
        }),
        catchError((error: HttpErrorResponse) => {
          return of(error);
        })
      );
  }

  deleteUser() {
    return this.http
      .delete(`${this.baseUrl}/users/${this.user.id}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      })
      .pipe(
        tap(() => {
          this.logout();
        }),
        catchError((error: HttpErrorResponse) => {
          return of(error);
        })
      );
  }

  logout() {
    this.token = '';
    this.user.name = '';
    this.user.id = '';
    this.user.login = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
