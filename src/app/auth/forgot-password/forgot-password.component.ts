import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from "../auth.service";
import {Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

@Component({
  selector: 'kcci-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPass = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  otpForm = this.fb.group({
    otp: ['', [Validators.required,]],
  });
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: SharedSnackbarService
  ) {}
  forgotPassMail = ''
  otpCode =''
  setNewPassword = this.fb.group({
    password: ['', [Validators.required,]],
    passwordAgain: ['', [Validators.required,]],
  });
  forgotPassComponent() {

    this.auth.forgotPassData(this.forgotPass.value.email).subscribe(res=>{
      this.forgotPassMail = this.forgotPass.value.email;
    })
  }
  resendCode(){
    this.auth.forgotPassData(this.forgotPassMail)
  }
  otpSumit(){
    this.otpCode = this.otpForm.value.otp
  }
  // @ts-ignore
  channgePassword(){
    const payload ={
      "email": this.forgotPassMail,
      "new_password": this.setNewPassword.value.password,
      "otp": this.otpCode
    }
    this.auth.chnagePasword(payload).subscribe((res)=>{
      //console.log(res.status)
      if(res.status ==='success'){
        this.router.navigate(['auth/login']).then( _=> {
          this.snackBar.openSnackBar('SUCCESS!','Password Changed Successfully!', 2000,'sb-success');
        })
      }
    },
      error => {
      this.snackBar.openSnackBar('Error!',error,2000,'sb-error');

  })
  }
  ngOnInit(): void {}
}
