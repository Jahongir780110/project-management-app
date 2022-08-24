import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit(): void {}
}
