import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, throwError, timeout } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../../auth/auth.service';
import { TokenService } from '../../auth/token.service';
import { SharedSnackbarService } from '../snackbar/shared-snackbar.service';

@Injectable()
export class ApiCallInterceptor implements HttpInterceptor {
  public static refreshTokenInterval: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private snackBar: SharedSnackbarService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();
    if (accessToken && request.params.get('grant_type') !== 'refresh_token') {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    if (!request.headers.has('content-type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json',
        },
      });
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log("event => ", event)
          setTimeout(() => {
            if (
              this.tokenService.getAccessToken() &&
              !this.authService.refreshTokenInterval
            ) {
              const jwtToken = this.tokenService.getAccessToken();
              let jwt_data: any;
              if (jwtToken != null) {
                jwt_data = jwt_decode(jwtToken);
              }
              const expires = new Date(parseInt(jwt_data.exp) * 1000);
              const timeout = expires.getTime() - Date.now() - 60 * 1000;
              // console.log('timeout:'+timeout)
              this.authService.refreshTokenInterval = setInterval(() => {
                if (
                  this.authService.isAccessTokenExpired(
                    this.tokenService.getAccessToken()
                  )
                ) {
                  this.authService
                    .refreshToken({
                      refresh_token: this.tokenService.getRefreshToken(),
                    })
                    .subscribe((res) => {
                      // AuthService.log(res);
                    });
                }
              }, timeout);
            }
          }, 500);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (error.error.error === 'invalid_token') {
            this.authService
              .refreshToken({
                refresh_token: refreshToken,
              })
              .subscribe(() => {
                location.reload();
              });
          } else {
            this.router.navigate(['auth/login']).then((_) => {
              this.snackBar.openSnackBar(
                'HTTP ERROR! ',
                'Redirecting to login pagen.',
                'sb-error'
              );
            });
          }
        } else if (error.status === 400) {
          this.snackBar.openSnackBar(
            'HTTP ERROR! ',
            'Redirecting to login page',
            'sb-error'
          );
        } else if (error.status === 0) {
          this.snackBar.openSnackBar(
            'ERROR!',
            'Internal server error!',
            'sb-error'
          );
        }
        return throwError(error);
      })
    );
  }
}
