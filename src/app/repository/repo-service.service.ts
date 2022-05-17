import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};
const BASE_URL = 'http://192.168.68.114:4202/api/v1/';
@Injectable({
  providedIn: 'root',
})
export class RepoServiceService {
  constructor(private http: HttpClient) {}

  getCompanyInfo(companyID: any): Observable<any> {
    return this.http.get(BASE_URL + 'companies/' + companyID , {
      params: { loadRepositories: true, loadApplications: true },
    });
  }

  addRepository(companyID: any): Observable<any> {
    HTTP_OPTIONS.params = {
      companyUpdateOption: 'APPEND_REPOSITORY'
    };
    let newRepo={
      "repositories": [
          {
              "type": "gitlab",
              "token": "MyTokens",
              "applications": [
                  {
                      "_metedata": {
                          "name": "SomeApplication"
                      },
                      "url": "ssssssssssssssss"
                  }
              ]
          }
      ]
  }
    // return this.http.post(BASE_URL + 'applications', appPayload, HTTP_OPTIONS);
    return this.http
      .put(BASE_URL + 'companies/' + companyID + '/repositories', newRepo, HTTP_OPTIONS)
      .pipe(
        map((res: any) => {
          // this._refreshNeeded$.next();
          console.log('Response Log: ', res);
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
  
  // addRepository(companyID: any): Observable<any> {
  //   let newRepo=[
  //     {
  //       token:'skd2f1d2f1d2f12dff',
  //       type:'github'
  //     }
  //   ]
    
  //   return this.http.put(BASE_URL + 'companies/' + companyID + '/repositories',newRepo, {
  //     params: { 
  //       companyUpdateOption: 'APPEND_REPOSITORY' },
  //   });
  // }

  getApplicationById(
    appId: string | null,
    repoId: string | null,
    companyId: string | null
  ) {
    HTTP_OPTIONS.params = {
      companyId: companyId,
      repositoryId: repoId,
    };
    return this.http.get(BASE_URL + 'applications/' + appId, HTTP_OPTIONS);
  }

  getBranch(repoType: string, repoId: string, repoUrl: string) {
    HTTP_OPTIONS.params = {
      repoId: repoId,
      url: repoUrl,
    };
    return this.http.get(BASE_URL + repoType + '/branches', HTTP_OPTIONS);
  }
}
