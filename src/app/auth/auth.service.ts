import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {TokenService} from "./token.service";
import * as endpoints from "./auth.endpoint";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import jwt_decode from "jwt-decode";
const BASE_URL = environment.v1AuthEndpoint;
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: {}
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = '';
  refreshTokenInterval: any;
  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An Error occurred: ', error.error.message)
    } else {
      console.error(
        `Error Code From Backend: ${error.status}`,
        `Body: ${error.error}`
      )
    }

    return throwError(
      'Internal server error!'
    )
  };

  private static log(message: string): any {
    console.log(message);
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router) {
  }

  login(loginPayload: any): Observable<any> {
    HTTP_OPTIONS.params = {
      grant_type: 'password',
      token_type: 'regular'
    }
    return this.http.post(BASE_URL + endpoints.LOGIN, loginPayload, HTTP_OPTIONS).pipe(
      tap((res: any) => {
        AuthService.log('login')
        if(this.tokenService.getAccessToken()) {
         this.refreshTokenInterval =  setInterval(() => {
           if(this.isAccessTokenExpired(this.tokenService.getAccessToken()) ){
             this.refreshToken({refresh_token: this.tokenService.getRefreshToken()}).subscribe(res => {
               AuthService.log(res)
             })
           }
          },2000); // TODO: This is not the right way but it will do for now
        }
      }),
      catchError(AuthService.handleError))
  }

  signUp(signUpPayload: any): Observable<any> {
    return this.http.post(BASE_URL + endpoints.REGISTER, signUpPayload, HTTP_OPTIONS).pipe(
      tap(_ => AuthService.log('registered!')),
      catchError(AuthService.handleError));
  }

  refreshToken(refreshTokenData: any): Observable<any> {
    HTTP_OPTIONS.params = {
      grant_type: 'refresh_token',
      token_type: 'regular'
    }
    return this.http.post(BASE_URL + endpoints.LOGIN, refreshTokenData, HTTP_OPTIONS).pipe(
      tap((res: any) => {
        this.tokenService.removeAccessToken();
        this.tokenService.removeRefreshToken();
        this.tokenService.saveAccessToken(res.access_token);
        this.tokenService.saveRefreshToken(res.refresh_token);
      }),
      catchError(AuthService.handleError));
  }

  logOut(): void {
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();
    setTimeout(() => {
      clearInterval(this.refreshTokenInterval);
      this.router.navigate(['/auth/register']);
    }, 1000);
  }

  isAccessTokenExpired(accessToken: any): boolean {
    const decoded: any = jwt_decode(accessToken);
    const expMilSecond: number = decoded?.exp * 1000;
    const currentTime = Date.now();
    console.log(expMilSecond - currentTime, 'Difference');
    if (expMilSecond < currentTime) {
      return true;
    }
    return false;
  }
  timeDiff(accessToken: string): any {
    const decoded: any = jwt_decode(accessToken);
    const expMilSecond: number = decoded?.exp * 1000;
    const currentTime = Date.now();

    return (expMilSecond - currentTime);
  }
  getUserData(): any {
    let data: any;
    if(this.tokenService.getAccessToken()) {
      const token = this.tokenService.getAccessToken()
      if (token != null && !this.isAccessTokenExpired(token)) {
        const decoded: any = jwt_decode(token);
         data = {
          ...decoded.data
        };
        return data
      }
    }
     return [];
  }
}
