import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {UserDataService} from "../../shared/services/user-data.service";
import {Router} from "@angular/router";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

@Component({
  selector: 'kcci-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  setNewPassword = this.fb.group({
    oldpass: ['', [Validators.required,]],
    newpass: ['', [Validators.required,]],
    newpassconfirm: ['', [Validators.required,]],
  },
    {
      validator: this.confirmPasswordMatch('newpass', 'newpassconfirm'),
    }
    );

    user: any = this.auth.getUserData();
    userPersonalInfo: any;
    userEmail: string = '';
  otpForm =true;
  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private userData :UserDataService,
              private router: Router,
              private snackBar : SharedSnackbarService,
              ) { }
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
    this.userData.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.userEmail = res.data.email;
      
    });
  }
  sendOtp(){
    this.otpForm = false
  }
  changePassword(){
    const user = this.auth.getUserData();
    
    const payload ={
      "email": this.userEmail,
      "current_password": this.setNewPassword.value.oldpass,
      "new_password": this.setNewPassword.value.newpass,
    }
    this.auth.chnagePasword(payload).subscribe((res)=>{
      if(res.status ==='success'){
        this.router.navigate(['']).then( _=> {
          this.snackBar.openSnackBar('SUCCESS!','Password Changed Successfully!','sb-success');
        })
      }
    })
  }
}
