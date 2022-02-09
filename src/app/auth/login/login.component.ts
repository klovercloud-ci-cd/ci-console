import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [],
      password: []
    })
  }

}
