import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthUser } from '../../models/authUser.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  form: AuthUser = {
    login: '',
    password: '',
    name: '',
  };
  repeatPassword = '';
  nameError = false;
  loginError = false;
  passwordError = false;
  repeatPasswordError = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form.name = this.userService.user.name;
    this.form.login = this.userService.user.login;
  }

  delete() {
    this.userService.deleteUser().subscribe((res) => {
      if (res instanceof HttpErrorResponse) {
        return this.showErrorAlert(res);
      }

      this.showSuccessAlert('User successfully deleted!');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    });
  }

  onSubmit(e: Event): any {
    e.preventDefault();

    this.nameError = false;
    this.loginError = false;
    this.passwordError = false;
    this.repeatPasswordError = false;

    if (!this.form.name?.trim().length) {
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
    if (this.form.password.trim() !== this.repeatPassword) {
      this.repeatPasswordError = true;
      return;
    }

    this.userService.editProfile(this.form).subscribe((res) => {
      if (res instanceof HttpErrorResponse) {
        return this.showErrorAlert(res);
      }

      this.showSuccessAlert('User successfully edited!');
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

  showSuccessAlert(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ['error-snackbar', 'bg-success', 'text-white'],
      verticalPosition: 'top',
    });
  }
}
