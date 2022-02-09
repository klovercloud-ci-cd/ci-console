import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {TokenService} from "./token.service";

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
    if(error.error instanceof ErrorEvent) {
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
    return this.http.post(BASE_URL, loginPayload, HTTP_OPTIONS).pipe(
      tap(_=> AuthService.log('login')),
      catchError(AuthService.handleError))
  }

  signUp(signUpPayload: any): Observable<any> {
    return this.http.post(BASE_URL, signUpPayload, HTTP_OPTIONS).pipe(
      tap(_=> AuthService.log('register')),
      catchError(AuthService.handleError));
  }
}
