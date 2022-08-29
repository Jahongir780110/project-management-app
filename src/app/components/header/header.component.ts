import { Component, OnInit } from '@angular/core';
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

  constructor(public userService: UserService) {}

  ngOnInit(): void {}
}
