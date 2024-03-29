import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
import { catchError, of, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TokenService } from '../auth/token.service';
import {Router} from "@angular/router";

const BASE_URL = environment.v1ApiEndPoint;
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};

@Injectable({
  providedIn: 'root',
})
export class AppListService {
  constructor(private http: HttpClient, private token: TokenService,private router: Router) {}

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getRepositoryInfo(companyID: any, repoId: any): Observable<any> {
    return this.http.get(`${BASE_URL}repositories/${repoId}`, {
      params: {
        companyId: companyID,
        loadApplications: true,
      },
    })
  }

  getAppSteps(companyID:String,repoId: String,appURL:String): Observable<any> {
    HTTP_OPTIONS.params = {
      companyId: companyID,
      repositoryId:  repoId,
      url:appURL,
      action: 'GET_PIPELINE_FOR_VALIDATION'
    };
    return this.http.get(`${BASE_URL}pipelines`, HTTP_OPTIONS);
  }

  addApplication(
    appPayload: any,
    companyID: any,
    repoId: any
  ): Observable<any> {
    HTTP_OPTIONS.params = {
      companyUpdateOption: 'APPEND_APPLICATION',
    };
    return this.http
      .put(`${BASE_URL}companies/${companyID}/repositories/${repoId}/applications`, appPayload, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          this.router.navigate([`/repository/${repoId}`])
            .then(() => {
              window.location.reload();
            });
          this._refreshNeeded$.next();
          }),
        catchError((error: HttpErrorResponse): Observable<any> => {
          // we expect 404, it's not a failure for us.
          if (error.status === 404) {
            return of(null); // or any other stream like of('') etc.
          }

          // other errors we don't know how to handle and throw them further.
          return throwError(error);
        })
      );
  }

  deleteApplication(
    appPayload: any,
    companyID: any,
    repoId: any
  ): Observable<any> {
    HTTP_OPTIONS.params = {
      companyId: companyID,
      repositoryId: repoId,
      companyUpdateOption: 'DELETE_APPLICATION',
    };
    return this.http
      .put(`${BASE_URL}companies/${companyID}/repositories/${repoId}/applications`, appPayload, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          this._refreshNeeded$.next();
        }),
        catchError((error: HttpErrorResponse): Observable<any> => {
          // we expect 404, it's not a failure for us.
          if (error.status === 404) {
            return of(null); // or any other stream like of('') etc.
          }

          // other errors we don't know how to handle and throw them further.
          return throwError(error);
        })
      );
  }

  updateWebhook(qp: any): Observable<any> {
    HTTP_OPTIONS.params = {
      action: qp.action,
      // companyId: qp.companyId,
      appId: qp.appId,
      url: qp.url,
      webhookId: qp.webhookId,
      // companyUpdateOption: 'DELETE_APPLICATION',
    };
    return this.http
      .patch(
        `${BASE_URL}companies/${qp.companyId}/repositories/${qp.repoId}/webhooks`,
        '',
        HTTP_OPTIONS
      )
      .pipe(
        map((res: any) => {
          this._refreshNeeded$.next();
        }),
        catchError((error: HttpErrorResponse): Observable<any> => {
          // we expect 404, it's not a failure for us.
          if (error.status === 404) {
            return of(null); // or any other stream like of('') etc.
          }

          // other errors we don't know how to handle and throw them further.
          return throwError(error);
        })
      );
  }
  getProcessDetails(processId: any) {
    return this.http.get(`${BASE_URL}processes/${processId}`, HTTP_OPTIONS);
  }

  getAppDetails(repoId: any, appId: any) {
    HTTP_OPTIONS.params = {
      repositoryId: repoId,
    };
    return this.http.get(`${BASE_URL}applications/${appId}`, HTTP_OPTIONS);
  }

}
