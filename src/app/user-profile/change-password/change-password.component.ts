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
    });
  otpForm =true;
  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private userData :UserDataService,
              private router: Router,
              private snackBar : SharedSnackbarService
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
  }
  sendOtp(){
    this.otpForm = false
  }
  channgePassword(){
    const user = this.auth.getUserData();
    let email;
    this.userData.getUserInfo(user.user_id).subscribe(res=>{
      email = res.data.email;
    })
    const payload ={
      "email": email,
      "current_password": this.setNewPassword.value.oldpass,
      "new_password": this.setNewPassword.value.newpass,
    }
    this.auth.chnagePasword(payload).subscribe((res)=>{
      //console.log(res.status)
      if(res.status ==='success'){
        this.router.navigate(['']).then( _=> {
          this.snackBar.openSnackBar('SUCCESS!','Password Changed Successfully!', 2000,'sb-success');
        })
      }
    })
  }

}
