import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { AuthUser } from '../../models/authUser.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: AuthUser = {
    login: '',
    password: '',
  };

  loginError = false;
  passwordError = false;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((val) => {});
  }

  onSubmit(e: Event): any {
    e.preventDefault();

    this.loginError = false;
    this.passwordError = false;

    if (!this.form.login.trim().length) {
      this.loginError = true;
      return;
    }
    if (!this.form.password.trim().length) {
      this.passwordError = true;
      return;
    }

    this.isLoading = true;

    this.userService
      .signIn({ login: this.form.login, password: this.form.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/boards']);
        },
        error: (err) => {
          this.isLoading = false;
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
