import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {TokenService} from "./token.service";
import * as endpoints from "./auth.endpoint";

const OAUTH_CLIENT = '';
const OAUTH_SECRET = '';
const BASE_URL = 'http://localhost:2022/'
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + btoa(OAUTH_CLIENT + OAUTH_SECRET)
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = '';

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

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  login(loginPayload: any): Observable<any> {
    return this.http.post(BASE_URL + endpoints.LOGIN, loginPayload, HTTP_OPTIONS).pipe(
      tap(_ => AuthService.log('login')),
      catchError(AuthService.handleError))
  }

  signUp(signUpPayload: any): Observable<any> {
    return this.http.post(BASE_URL + endpoints.REGISTER, signUpPayload, HTTP_OPTIONS).pipe(
      tap(_ => AuthService.log('register')),
      catchError(AuthService.handleError));
  }

  refreshToken(refreshTokenData: any): Observable<any> {
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('refresh-token', refreshTokenData.refresh_token)
      .set('grant-type', 'refresh_token')
    return this.http.post(BASE_URL + endpoints.REFRESH_TOKEN, body, HTTP_OPTIONS).pipe(
      tap((res: any) => {
        this.tokenService.saveAccessToken(res.access_token);
        this.tokenService.saveRefreshToken(res.refresh_token);
      }),
      catchError(AuthService.handleError));
  }
}
