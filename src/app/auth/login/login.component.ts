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
    this.logIn();
  }
  logIn(): void {
    this.authService.login({email: 'shabrul2451@gmail.com', password: 'bh0974316'}).subscribe(res => {
      this.tokenService.saveAccessToken(res.data.access_token);
      this.tokenService.saveRefreshToken(res.data.refresh_token);
      console.log(this.authService.getUserData(), 'USER')
    })
  }
  logout(): void {
    this.authService.logOut();
  }
}
