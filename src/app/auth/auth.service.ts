import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { TokenService } from './token.service';
import * as endpoints from './auth.endpoint';
import { environment } from '../../environments/environment';
import { SharedSnackbarService } from '../shared/snackbar/shared-snackbar.service';

const BASE_URL = environment.v1AuthEndpoint;
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  redirectUrl = '';

  refreshTokenInterval: any;

  constructor(
    private snackBar: SharedSnackbarService,
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // @ts-ignore
      return throwError('An Error occurred: ', error.error.message);
    }
    return throwError(`${error.error.message}`);

    // return throwError('Internal server error!');
  }

  static log(message: string): any {
    console.log(message);
  }

  login(loginPayload: any): Observable<any> {
    var date = new Date();
    localStorage.setItem('loginTime',date.toISOString());
    HTTP_OPTIONS.params = {
      grant_type: 'password',
    };
    return this.http
      .post(BASE_URL + endpoints.LOGIN, loginPayload, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          AuthService.log('login');
        }),
        catchError(this.handleError)
      );
  }

  signUp(signUpPayload: any): Observable<any> {
    return this.http
      .post(BASE_URL + endpoints.REGISTER, signUpPayload, HTTP_OPTIONS)
      .pipe(
        tap((_) => AuthService.log('registered!')),
        catchError(this.handleError)
      );
  }

  refreshToken(refreshTokenData: any): Observable<any> {
    HTTP_OPTIONS.params = {
      grant_type: 'refresh_token',
    };
    return this.http
      .post(BASE_URL + endpoints.REFRESH_TOKEN, refreshTokenData, HTTP_OPTIONS)
      .pipe(
        tap((event: any) => {
          // Save new Tokens
          this.tokenService.removeAccessToken();
          this.tokenService.removeRefreshToken();
          this.tokenService.saveAccessToken(event.data.access_token);
          this.tokenService.saveRefreshToken(event.data.refresh_token);
          // return event;
        }),
        catchError(this.handleError)
      );
  }

  logOut(): void {

    localStorage.removeItem('loginTime');
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();
    setTimeout(() => {
      clearInterval(this.refreshTokenInterval);
      this.refreshTokenInterval = null;
      this.router.navigate(['/auth/login']);
    }, 1000);
  }

  isAccessTokenExpired(accessToken: any): boolean {
    const decoded: any = jwt_decode(accessToken);
    const expMilSecond: number = decoded?.exp * 1000;
    const currentTime = Date.now() + 60000;
    if (expMilSecond - currentTime < 0) {
      clearInterval(this.refreshTokenInterval);
      this.refreshTokenInterval = null;
      return true;
    }
    return false;
  }

  getUserData(): any {
    let data: any;
    if (this.tokenService.getAccessToken()) {
      const token = this.tokenService.getAccessToken();
      if (token != null) {
        const decoded: any = jwt_decode(token);
        data = {
          ...decoded.data,
        };
        return data;
      }
    }
    return [];
  }

  isLogin() {
    if (
      this.tokenService.getRefreshToken() &&
      !this.isAccessTokenExpired(this.tokenService.getRefreshToken())
    ) {
      return true;
    }
    return false;
  }

  forgotPassData(media: string): Observable<any> {
    HTTP_OPTIONS.params = {
      action: 'forgot_password',
      media,
    };
    return this.http.put(
      BASE_URL + endpoints.FORGOT_PASSWORD,
      '',
      HTTP_OPTIONS
    ).pipe(
      tap((event: any) => {}),
      catchError(this.handleError)
    );
  }

  chnagePasword(payload: any): Observable<any> {
    HTTP_OPTIONS.params = {
      action: 'reset_password',
    };
    return this.http
      .put(BASE_URL + endpoints.FORGOT_PASSWORD, payload, HTTP_OPTIONS)
      .pipe(
        tap((event: any) => {}),
        catchError(this.handleError)
      );
  }
}
