import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, switchMap, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {TokenService} from "../../auth/token.service";

@Injectable()
export class ApiCallInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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
          /*if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            const token = this.tokenService.getRefreshToken();
            if (token)
              return this.authService.refreshToken(token).pipe(
                switchMap((token: any) => {
                  this.isRefreshing = false;
                  this.tokenService.saveToken(token.accessToken);
                  this.refreshTokenSubject.next(token.accessToken);

                  return next.handle(this.addTokenHeader(request, token.accessToken));
                }),
                catchError((err) => {
                  this.isRefreshing = false;

                  this.tokenService.signOut();
                  return throwError(err);
                })
              );
          }
          return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
          );
        }
      private addTokenHeader(request: HttpRequest<any>, token: string) {
          /!* for Spring Boot back-end *!/
          // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
          /!* for Node.js Express back-end *!/
          return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
        }*/
          /*if (!this.isRefreshing){
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            const token = this.tokenService.getRefreshToken();
            if (token){
              this.authService.refreshToken(token).pipe(
                switchMap((token: any) => {
                  this.isRefreshing = false;
                  this.tokenService.saveAccessToken(token.accessToken);
                  this.refreshTokenSubject.next(token.accessToken);

                  return next.handle(this.addTokenHeader(request, token.accessToken));
                })
              )
            }
          }*/
        }
        return throwError(error);
      })
    );
  }
}
