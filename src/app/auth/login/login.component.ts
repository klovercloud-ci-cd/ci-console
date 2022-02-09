import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(
    private authService: AuthService,
    private tokenService: TokenService) { }

  ngOnInit(): void {


    this.authService.login({hola: 'hola'}).subscribe(res => {
      console.log(res);
    })
  }

}
