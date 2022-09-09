import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';

import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  faTableColumns = faTableColumns;
  faUser = faUser;
  faRightFromBracket = faRightFromBracket;

  constructor(
    public userService: UserService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  get currentLang() {
    return (
      this.translateService.currentLang?.split('-')[0] ||
      this.translateService.getDefaultLang()?.split('-')[0]
    );
  }

  ngOnInit(): void {}

  changeLang(value: string) {
    this.translateService.use(value);
    localStorage.setItem('lang', value);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
