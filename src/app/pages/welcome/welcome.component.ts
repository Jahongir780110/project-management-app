import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  openBoards() {
    if (!this.userService.isAuthenticated) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/boards']);
    }
  }
}
