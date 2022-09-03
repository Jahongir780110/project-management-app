import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'project-management-app';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    let user;
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user') || '');
    }

    if (user && token) {
      this.userService.token = token;
      this.userService.user = user;
    }
  }
}
