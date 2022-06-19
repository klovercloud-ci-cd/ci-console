import  {
  HttpClient,
  HttpErrorResponse} from '@angular/common/http';
import {
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Router } from '@angular/router';
import  { Observable} from 'rxjs';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import  { TokenService } from '../auth/token.service';

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
export class AttachCompanyService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An Error occurred: ', error.error.message);
    } else {
      console.error(
        `Error Code From Backend: ${error.status}`,
        `Body: ${error.error}`
      );
    }
    return throwError(error);
  }

  attachCompany(attachCompanyPayload: any): Observable<any> {
    HTTP_OPTIONS.params = {
      action: 'attach_company',
    };

    return this.http
      .put(`${BASE_URL}users`, attachCompanyPayload, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          console.log('Response Log: ', res);
        }),
        catchError(AttachCompanyService.handleError)
      );
  }
}
