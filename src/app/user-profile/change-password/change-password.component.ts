import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { AuthService } from '../../auth/auth.service';
import { UserDataService } from '../../shared/services/user-data.service';
import { SharedSnackbarService } from '../../shared/snackbar/shared-snackbar.service';

@Component({
  selector: 'kcci-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  isLoading = false;

  setNewPassword = this.fb.group(
    {
      oldpass: ['', [Validators.required]],
      newpass: ['', [Validators.required]],
      newpassconfirm: ['', [Validators.required]],
    },
    {
      validator: this.confirmPasswordMatch('newpass', 'newpassconfirm'),
    }
  );

  user: any = this.auth.getUserData();

  userPersonalInfo: any;

  userEmail = '';

  otpForm = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userData: UserDataService,
    private router: Router,
    private snackBar: SharedSnackbarService,
    private _toolbarService: ToolbarService
  ) {}

  confirmPasswordMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Settings' });
    this.userData.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.userEmail = res.data.email;
    });
  }

  changePassword() {
    this.isLoading = true;
    const user = this.auth.getUserData();

    const payload = {
      email: this.userEmail,
      current_password: this.setNewPassword.value.oldpass,
      new_password: this.setNewPassword.value.newpass,
    };
    this.auth.chnagePasword(payload).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.router.navigate(['']).then((_) => {
            this.snackBar.openSnackBar(
              'SUCCESS!',
              'Password Changed Successfully!',
              'sb-success'
            );
          });
        }
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Error!', error, 'sb-error');
      }
    );
  }
}
