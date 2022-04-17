import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'kcci-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePassOtp = this.fb.group({
    otp: ['', [Validators.required,]],
  });
  otpForm =true;
  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
  }
  sendOtp(){
    this.otpForm = false
  }

}
