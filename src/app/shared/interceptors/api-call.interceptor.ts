import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {TokenService} from "../../auth/token.service";

@Injectable()
export class ApiCallInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if(accessToken) {
      request = request.clone({
          setHeaders: {
            Authorization: "Bearer " + accessToken
          }
        }
      )
    }

    if(!request.headers.has('content-type')) {
      request = request.clone({
        setHeaders: {
          'content-type': "application/json"
        }
      })
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if(event instanceof HttpResponse) {
            console.log("event => ", event)
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          if(error.error.error === 'invalid_token') {
            this.authService.refreshToken({
              refresh_token: refreshToken
            }).subscribe(() => {
              location.reload();
            })
          } else {
            this.router.navigate(['login']).then( _=> {
              console.log('Redirecting to login page');
            })
          }
        }
        return throwError(error);
      })
    );
  }
}
