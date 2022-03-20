import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../auth.service";
import {TokenService} from "../token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'kcci-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private tokenService: TokenService,
              private router : Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLogin()){
      this.router.navigate([''])
    }
  }

}
