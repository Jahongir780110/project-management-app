import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../user.service';
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
  isLoading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSubmit(login: NgForm): any {
    if (login.invalid) {
      Object.keys(login.controls).forEach((field) => {
        login.controls[field].markAsTouched({ onlySelf: true });
      });

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
