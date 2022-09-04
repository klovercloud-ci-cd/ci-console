import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

@Component({
  selector: 'kcci-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = this.auth.getUserData();
  userResourceArray:any;

  userInfo: any;

  constructor(
    private _toolbarService: ToolbarService,
    private userData: UserDataService,
    private auth: AuthService,
    private snack: SharedSnackbarService,
  ) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Account' });
    this.userData.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userInfo = res;
      this.userResourceArray = res.data.resource_permission.resources;
    },(err)=>{
      this.snack.openSnackBar('User not found!',err.error.message,'sb-error')
    });
  }

}
