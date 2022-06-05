import  {
  HttpClient,
  HttpErrorResponse} from '@angular/common/http';
import {
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import  { Observable} from 'rxjs';
import { catchError, of, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  constructor(private http: HttpClient) {}

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getRepositoryInfo(companyID: any, repoId: any): Observable<any> {
    return this.http.get(`${BASE_URL  }repositories/${  repoId}`, {
      params: {
        companyId: companyID,
        loadApplications: true,
      },
    });
  }

  addApplication(
    appPayload: any,
    companyID: any,
    repoId: any
  ): Observable<any> {
    HTTP_OPTIONS.params = {
      companyId: companyID,
      repositoryId: repoId,
      companyUpdateOption: 'APPEND_APPLICATION',
    };
    // return this.http.post(BASE_URL + 'applications', appPayload, HTTP_OPTIONS);
    return this.http
      .post(`${BASE_URL  }applications`, appPayload, HTTP_OPTIONS)
      .pipe(
        map((res: any) => {
          this._refreshNeeded$.next();
          console.log('Response Logg: ', res);
        }),
        // map(()=>{
        //   this._refreshNeeded$.next();
        // }),
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
    console.log('Payload: ', appPayload, companyID, repoId);

    // return this.http.post(BASE_URL + 'applications', appPayload, HTTP_OPTIONS);
    return this.http
      .post(`${BASE_URL  }applications`, appPayload, HTTP_OPTIONS)
      .pipe(
        map((res: any) => {
          this._refreshNeeded$.next();
          console.log('Response Log: ', res);
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
      // repoId: qp.repoId,
      url: qp.url,
      webhookId: qp.webhookId,
      // companyUpdateOption: 'DELETE_APPLICATION',
    };
    console.log('QP:', qp);

    // return this.http.post(BASE_URL + 'applications', appPayload, HTTP_OPTIONS);
    return this.http
      .patch(
        `${BASE_URL
          }companies/${
          qp.companyId
          }/repositories/${
          qp.repoId
          }/webhooks`,
        '',
        HTTP_OPTIONS
      )
      .pipe(
        map((res: any) => {
          this._refreshNeeded$.next();
          console.log('Response Log: ', res);
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
}
