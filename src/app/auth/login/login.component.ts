import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logIn();
    if (this.authService.isLogin()) {
      this.router.navigate(['']);
    }
  }
  loginForm: any = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required],
  });
  logIn(): void {
    this.authService
      .login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .subscribe((res) => {
        this.tokenService.saveAccessToken(res.data.access_token);
        this.tokenService.saveRefreshToken(res.data.refresh_token);
        console.log(this.authService.getUserData(), 'USER');
      });
  }
  logout(): void {
    this.authService.logOut();
  }
}
