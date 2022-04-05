import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from "../auth.service";
import {tap} from "rxjs";

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
    private auth: AuthService
  ) {}
  forgotPassMail = ''
  otpCode =''
  setNewPassword = this.fb.group({
    password: ['', [Validators.required,]],
    passwordAgain: ['', [Validators.required,]],
  });
  forgotPassComponent() {

    this.forgotPassMail = this.forgotPass.value.email;
    this.auth.forgotPassData(this.forgotPassMail).subscribe(res=>{
      console.log(this.forgotPassMail)
    })
  }
  resendCode(){
    this.auth.forgotPassData(this.forgotPassMail)
  }
  otpSumit(){
    this.otpCode = this.otpForm.value.otp
  }
  channgePassword(){

  }
  ngOnInit(): void {}
}
