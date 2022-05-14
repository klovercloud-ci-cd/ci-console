import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const BASE_URL = 'http://192.168.68.114:4202/api/v1/';
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

  getRepositoryInfo(companyID: any, repoId: any): Observable<any> {
    return this.http.get(BASE_URL + 'repositories/' + repoId, {
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
      .post(BASE_URL + 'applications', appPayload, HTTP_OPTIONS)
      .pipe(
        map((res: any) => {
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
      .post(BASE_URL + 'applications', appPayload, HTTP_OPTIONS)
      .pipe(
        map((res: any) => {
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
