import { Component, OnInit } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';
import { UserService } from './services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translateService.use(lang);
    }

    this.userService.tryLogin();

    const original = DefaultValueAccessor.prototype.registerOnChange;
    DefaultValueAccessor.prototype.registerOnChange = function (fn) {
      return original.call(this, (value) => {
        const trimmed = typeof value === 'string' ? value.trim() : value;
        return fn(trimmed);
      });
    };
  }
}
