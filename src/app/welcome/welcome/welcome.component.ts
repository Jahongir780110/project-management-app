import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user/user.service';

import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  faSackDollar = faSackDollar;
  faClock = faClock;
  faUserGroup = faUserGroup;
  faCertificate = faCertificate;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

  openBoards(): any {
    if (!this.userService.isAuthenticated) {
      return this.router.navigate(['/login']);
    }

    this.router.navigate(['/boards']);
  }
}
