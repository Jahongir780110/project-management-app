import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'project-management-app';

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    let user;
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user') || '');
    }
    const lang = localStorage.getItem('lang');

    if (lang) {
      this.translateService.use(lang);
    }

    if (user && token) {
      this.userService.token = token;
      this.userService.user = user;
      this.router.navigate(['/boards']);
    }
  }
}
