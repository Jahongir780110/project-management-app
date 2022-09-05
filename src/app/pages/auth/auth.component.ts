import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthUser } from '../../models/authUser.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isSignup = false;
  form: AuthUser = {
    login: '',
    password: '',
    name: '',
  };
  nameError = false;
  loginError = false;
  passwordError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['signup']) {
        this.isSignup = true;
      } else {
        this.isSignup = false;
      }
    });
  }

  onSubmit(e: Event): any {
    e.preventDefault();

    this.nameError = false;
    this.loginError = false;
    this.passwordError = false;

    if (this.isSignup && !this.form.name?.trim().length) {
      this.nameError = true;
      return;
    }
    if (!this.form.login.trim().length) {
      this.loginError = true;
      return;
    }
    if (!this.form.password.trim().length) {
      this.passwordError = true;
      return;
    }

    if (this.isSignup) {
      return this.userService.createUser(this.form).subscribe({
        next: () => {
          this.router.navigate(['/auth']);
        },
        error: (err) => {
          this.showErrorAlert(err);
        },
      });
    }

    this.userService
      .signIn({ login: this.form.login, password: this.form.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/boards']);
        },
        error: (err) => {
          this.showErrorAlert(err);
        },
      });
  }

  showErrorAlert(res: HttpErrorResponse) {
    const errMessage = Array.isArray(res.error.message)
      ? res.error.message[0]
      : res.error.message;

    this.snackBar.open(errMessage, undefined, {
      duration: 3000,
      panelClass: ['error-snackbar', 'bg-danger', 'text-white'],
      verticalPosition: 'top',
    });
  }
}
