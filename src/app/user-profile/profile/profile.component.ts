import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Component({
  selector: 'kcci-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = this.auth.getUserData();
  userPersonalInfo: any;

  constructor(
    private _toolbarService: ToolbarService,
    private userData: UserDataService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Account' });
    this.userData.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      console.log('this.userPersonalInfo', this.userPersonalInfo.data);
    });
  }
}
