import  { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import  { FormBuilder, FormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
import {Observable, tap} from "rxjs";
import  {Router} from "@angular/router";
import  {AuthService} from "../auth.service";
import  {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

@Component({
  selector: 'kcci-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  isLoading = false;
  gotoOtp:boolean = false;
  stayOnForget:boolean=true;
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
  },
  {
    validator: this.confirmPasswordMatch('password', 'passwordAgain'),
  });

  forgotPassComponent() {
    this.isLoading = true;
    this.forgotPassMail = this.forgotPass.value.email;
    this.auth.forgotPassData(this.forgotPassMail).subscribe((res)=>{
      console.log("Response: ",res);
      this.gotoOtp = true;
      this.stayOnForget = false;
        this.snackBar.openSnackBar('Submit OTP!', res.message,'sb-success');
    },
      (err) => {
        this.isLoading = false;
        this.snackBar.openSnackBar('Forget Password Failed!', err,'sb-error');
      })
  }

  resendCode(){
    this.auth.forgotPassData(this.forgotPassMail).subscribe((res)=>{
        console.log("Resend:",res);
      this.snackBar.openSnackBar('Submit OTP!', 'OTP Resend','sb-success');
      })
  }

  otpSumit(){
    this.otpCode = this.otpForm.value.otp;
    this.isLoading = true;
    setTimeout(()=>{
      this.isLoading = false;
    },250)
  }

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

  // @ts-ignore
  changePassword(){
    this.isLoading = true;
    const payload ={
      "email": this.forgotPassMail,
      "new_password": this.setNewPassword.value.password || '',
      "otp": this.otpCode || ''
    }
    this.auth.chnagePasword(payload).subscribe((res)=>{
      if(res.status ==='success'){
        this.isLoading = false;
        this.router.navigate(['auth/login']).then( _=> {
          this.snackBar.openSnackBar('SUCCESS!','Password Changed Successfully!','sb-success');
        })
      }
    },
    (err) => {
      this.isLoading = false;
      this.snackBar.openSnackBar('Password Change Failed!', err,'sb-error');
    })
  }

  ngOnInit(): void {}
}
