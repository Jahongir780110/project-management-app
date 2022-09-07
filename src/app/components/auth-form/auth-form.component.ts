import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthUser } from '../../models/authUser.model';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css'],
})
export class AuthFormComponent implements OnInit {
  type = '';

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
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    public dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((val) => {
      this.type = val['type'];

      if (this.type === 'editProfile') {
        if (!this.userService.isAuthenticated) {
          this.router.navigate(['/login']);
        } else {
          this.form.name = this.userService.user.name;
          this.form.login = this.userService.user.login;
        }
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(ConfirmDialogComponent, {
      data: {
        type: 'user',
      },
    });

    dialogRef.closed.subscribe((message) => {
      if (message) {
        this.deleteUser();
      }
    });
  }

  deleteUser() {
    const message: string = this.translateService.instant('deleteUserSuccess');

    this.userService.deleteUser().subscribe({
      next: () => {
        this.showSuccessAlert(message);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        this.showErrorAlert(err);
      },
    });
  }

  onSubmit(e: Event): any {
    e.preventDefault();

    this.nameError = false;
    this.loginError = false;
    this.passwordError = false;
    this.repeatPasswordError = false;

    if (this.type !== 'login' && !this.form.name?.trim().length) {
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
    if (
      this.type === 'editProfile' &&
      this.form.password.trim() !== this.repeatPassword
    ) {
      this.repeatPasswordError = true;
      return;
    }

    this.isLoading = true;

    if (this.type === 'login') {
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
    } else if (this.type === 'signup') {
      this.userService.createUser(this.form).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.showErrorAlert(err);
        },
      });
    } else if (this.type === 'editProfile') {
      const message: string = this.translateService.instant('userEditSuccess');

      this.userService.editProfile(this.form).subscribe({
        next: () => {
          this.showSuccessAlert(message);
        },
        error: (err) => {
          this.showErrorAlert(err);
        },
      });
    }
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
