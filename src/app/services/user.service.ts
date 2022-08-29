import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthUser } from '../models/authUser.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  token = '';
  isAuthenticated = false;
  baseUrl = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  createUser(authUser: AuthUser): Observable<User> {
    return this.http.post<User>(
      `${this.baseUrl}/signup`,
      authUser,
      this.httpOptions
    );
  }

  signIn(authUser: AuthUser) {
    return this.http
      .post(`${this.baseUrl}/signin`, authUser, this.httpOptions)
      .pipe(
        tap((user: any) => {
          this.token = user.token;
          this.isAuthenticated = true;
        })
      );
  }
}
