import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UnauthorisedErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private userService: UserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
          this.userService.logout();
        }

        return throwError(() => e);
      })
    );
  }
}
