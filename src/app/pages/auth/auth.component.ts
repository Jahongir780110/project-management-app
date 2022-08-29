import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
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
    private userService: UserService
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

  onSubmit(e: Event) {
    e.preventDefault();

    this.nameError = false;
    this.loginError = false;
    this.passwordError = false;

    if (this.isSignup) {
      if (!this.form.name?.trim().length) {
        this.nameError = true;
      }
    }
    if (!this.form.login.trim().length) {
      this.loginError = true;
    }
    if (!this.form.password.trim().length) {
      this.passwordError = true;
    }

    if (!this.nameError && !this.loginError && !this.passwordError) {
      if (this.isSignup) {
        this.userService.createUser(this.form).subscribe(() => {
          this.router.navigate(['/auth']);
        });
      } else {
        this.userService
          .signIn({ login: this.form.login, password: this.form.password })
          .subscribe((user) => {
            console.log('user', user);
          });
      }
    }
  }
}
