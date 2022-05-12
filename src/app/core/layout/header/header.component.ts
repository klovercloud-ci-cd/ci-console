import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { UserDataService } from '../../../shared/services/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private userInfo: UserDataService
  ) {}
  pageTitle: string = '';
  user: any = this.auth.getUserData();
  userPersonalInfo: any;
  ngOnInit(): void {
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
     // console.log('User Info: ', res);
    });
  }

  logout() {
    this.auth.logOut();
  }
}
